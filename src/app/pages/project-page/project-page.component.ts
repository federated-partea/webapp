import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ProjectModel} from '../../models/project.model';
import {ProjectService, ResultRow, ResultTable, TrafficLog} from '../../services/project.service';
import {TokenModel} from '../../models/token.model';
import {UserService} from '../../services/user.service';
import {UserModel} from '../../models/user.model';
import {environment} from '../../../environments/environment';
import {toastError, toastSuccess} from '../../../notifications';
import {delay} from 'rxjs/operators';
import * as bulmaToast from 'bulma-toast';
import {ApiService} from '../../services/api.service';

type AlgorithmType = 'univariate' | 'cox' | 'rsf';
type TimelineType = 'years' | 'months' | 'weeks' | 'days' | 'none';

declare var Plotly: any;


@Component({
    selector: 'app-project-page',
    templateUrl: './project-page.component.html',
    styleUrls: ['./project-page.component.scss']
})
export class ProjectPageComponent implements OnInit, OnDestroy {

    public user: UserModel | null = null;
    public projectId: number | null = null;
    public project: ProjectModel | null = null;
    public tokens: TokenModel[] = [];
    public traffic: TrafficLog[] = null;
    public filterClient: { [key: string]: boolean } = {};
    public filterDirection: 'in' | 'out' | null = null;
    public condition_text = '';
    public project_duration: number | undefined = undefined;
    public duration_format = 'seconds';

    public privacy_level: string;
    public epsilon: number;
    public method: AlgorithmType;
    public smpc = false;
    public from_time = 0.0;
    public to_time = 100.0;
    public step_size = 1.0;
    public max_iters = 10;
    public condition: string;
    public l1_ratio: number;
    public penalizer: number;
    public timeline: TimelineType;

    public resultTables: ResultTable[] = [];
    public selectedResultTable: ResultTable | null = null;
    public selectedResults: ResultRow[] = [];
    public p_values: any;

    private interval: any = null;
    public timeline_opacity: number;
    public timeline_pointer_events: string;
    public contributors_opacity: number;
    public contributors_pointer_events: string;
    public global_parameters_pointer_events: string;
    public global_parameters_opacity: number;
    public init_button_visibility: string;
    public projectRunPossible = false;
    public plot: any = {};

    public collabVisible = true;
    public trafficVisible = false;
    public parametersVisible = true;
    public resultsVisible = true;
    public summaryVisible = true;

    constructor(private projectService: ProjectService,
                private userService: UserService,
                private apiService: ApiService,
                private route: ActivatedRoute,
                public router: Router) {
        userService.subscribeUser(async (user) => {
            if (!user) {
                return;
            }
            this.user = user;
            if (!user) {
                toastError('You do not have access to this project. Please log in or choose a project you contributed to.');
                await this.router.navigate(['/']);
                return;
            }
            await this.refresh();
        });

        this.route.params.subscribe(async (params) => {
            let projectId = params.project_id;
            if (!projectId) {
                toastError('This project does not exist.');
                return;
            }
            projectId = Number(projectId);

            if (this.projectId !== projectId) {
                this.projectId = projectId;
            }

            this.project = await this.projectService.getProject(this.projectId);

            this.method = this.project.method;
            if (!this.method) {
                this.method = 'univariate';
            }
            this.epsilon = this.project.privacy_level;
            if (this.epsilon === 0.75) {
                this.privacy_level = 'high';
            } else if (this.epsilon === 1) {
                this.privacy_level = 'medium';
            } else if (this.epsilon === 3) {
                this.privacy_level = 'low';
            } else if (this.epsilon === 0) {
                this.privacy_level = 'none';
            } else {
                this.privacy_level = 'custom';
            }
            this.penalizer = this.project.penalizer;
            this.l1_ratio = this.project.l1_ratio;
            this.condition = this.project.conditions;
            this.timeline = this.project.timeline;
            this.step_size = this.project.step_size;
            this.from_time = this.project.from_time;
            this.to_time = this.project.to_time;
            this.smpc = this.project.smpc;
            this.condition_text = this.condition;
            console.log(this.project.state);
            if (this.project.state !== 'pre_start') {
                this.parametersVisible = false;
                await this.refresh();
            }

        });
    }

    async ngOnInit() {
        await this.refresh();
        if (this.project.state !== 'finished' && this.project.state !== 'error') {
            this.interval = setInterval(async () => {
                await this.refresh();
            }, 3000);
        }
    }

    ngOnDestroy() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }

    public checkProjectRun() {
        if (this.tokens.length === 0) {
            return false;
        }
        for (const token of this.tokens) {
            if (token.userId === null) {
                return false;
            }
            if (token.lastAction !== 'Running') {
                return false;
            }
        }
        return true;
    }

    public activateTimeline() {
        this.timeline_opacity = 1.0;
        this.timeline_pointer_events = 'auto';
    }

    public initializeProject() {
        this.project.method = this.method;
        this.project.state = 'initialized';
        this.project.timeline = this.timeline;
        this.project.from_time = this.from_time;
        this.project.to_time = this.to_time;
        this.project.step_size = this.step_size;
        this.project.smpc = this.smpc;
        if (this.project.method === 'univariate') {
            this.project.conditions = this.condition_text;
            if (this.privacy_level === 'low') {
                this.epsilon = 3;
            } else if (this.privacy_level === 'medium') {
                this.epsilon = 2;
            } else if (this.privacy_level === 'high') {
                this.epsilon = 1;
            } else if (this.privacy_level === 'none') {
                this.epsilon = 0;
            }

            this.project.privacy_level = this.epsilon;
        }
        if (this.project.method === 'cox') {
            this.project.penalizer = this.penalizer;
            this.project.l1_ratio = this.l1_ratio;
            this.project.max_iters = this.max_iters;
        }
        this.updateProject();
        this.parametersVisible = true;
        this.collabVisible = true;
    }


    public get filteredTraffic(): TrafficLog[] {
        return this.traffic.filter((t) => {
            if (this.filterClient[`${t.tokenId}`] === false) {
                return false;
            }
            return !(this.filterDirection !== null && this.filterDirection !== t.direction);
        });
    }

    public get clients(): string[] {
        return [...new Set(this.traffic.map(t => `${t.tokenId}`))];
    }

    public async refresh() {
        if (this.projectId && this.user) {
            this.project = await this.projectService.getProject(this.projectId);
            if (this.project.state === 'finished') {
                this.collabVisible = false;
                this.trafficVisible = false;
                this.resultsVisible = true;
            }
            if (this.haveRole('owner')) {
                await this.refreshTraffic();
                await this.refreshTokens();

                for (const client of this.clients) {
                    if (this.filterClient[client] !== false) {
                        this.filterClient[client] = true;
                    }
                }
            }
            if (this.project.state !== 'initialized' && this.project.state !== 'pre_start') {
                if (this.project.privacy_level === 0) {
                    this.privacy_level = 'none';
                } else if (this.project.privacy_level === 1) {
                    this.privacy_level = 'high';
                } else if (this.project.privacy_level === 2) {
                    this.privacy_level = 'medium';
                } else if (this.project.privacy_level === 3) {
                    this.privacy_level = 'low';
                } else {
                    this.privacy_level = 'custom';
                    this.epsilon = this.project.privacy_level;
                }
            }
            if (this.project.state === 'pre_start') {
                this.contributors_opacity = 0.5;
                this.contributors_pointer_events = 'none';
                this.global_parameters_pointer_events = 'auto';
                this.global_parameters_opacity = 1.0;
                this.init_button_visibility = 'visible';
                this.privacy_level = 'none';
                this.epsilon = 0;
            } else if (this.project.state === 'running' || this.project.state === 'waiting') {
                this.contributors_opacity = 0.5;
                this.contributors_pointer_events = 'none';
                this.global_parameters_pointer_events = 'none';
                this.global_parameters_opacity = 0.5;
                this.init_button_visibility = 'hidden';
            } else if (this.project.state === 'finished' || this.project.state === 'error') {
                this.contributors_opacity = 0.5;
                this.contributors_pointer_events = 'none';
                this.global_parameters_pointer_events = 'none';
                this.global_parameters_opacity = 0.5;
                this.init_button_visibility = 'hidden';
                const project_start = new Date(this.project.run_start);
                const project_end = new Date(this.project.run_end);
                this.project_duration = this.getDifferenceInMinutes(project_start, project_end);
                this.duration_format = 'minutes';
                if (this.project_duration <= 1) {
                    this.project_duration = this.getDifferenceInSeconds(project_start, project_end);
                    this.duration_format = 'seconds';
                }
                if (this.project_duration >= 60) {
                    this.project_duration = this.getDifferenceInHours(project_start, project_end);
                    this.duration_format = 'hours';
                }

                if (this.interval) {
                    clearInterval(this.interval);
                    delay(5);
                }
            } else {
                this.contributors_opacity = 1.0;
                this.contributors_pointer_events = 'auto';
                this.global_parameters_pointer_events = 'none';
                this.global_parameters_opacity = 0.5;
                this.init_button_visibility = 'hidden';
            }

            this.projectRunPossible = this.checkProjectRun();

            await this.refreshResults();

        }
    }

    public haveRole(role: string): boolean {
        if (!this.project) {
            return false;
        }
        return this.project.roles.indexOf(role) !== -1;
    }

    public async createToken() {
        await this.projectService.createToken(this.project);
        await this.refreshTokens();
    }

    public async deleteToken(token: TokenModel) {
        await this.projectService.deleteToken(token);
        await this.refreshTokens();
    }

    public async refreshResults() {

        this.resultTables = await this.projectService.getResultTables(this.project);
        if (this.resultTables.length > 0) {
            if (this.selectedResultTable === null) {
                await this.selectResultTable(this.resultTables[0]);
            } else {
                this.selectedResults = await this.projectService.getResults(this.project, this.selectedResultTable);

            }
            if (this.project.method === 'univariate' && this.resultTables.length === 2) {
                if (this.selectedResultTable.name === 'KM') {
                    this.plot = this.resultTables[0].plot;
                    this.plot = JSON.parse(this.plot);
                } else if (this.selectedResultTable.name === 'NA') {
                    this.plot = this.resultTables[1].plot;
                    this.plot = JSON.parse(this.plot);
                }
            } else if (this.project.method === 'univariate' && this.resultTables.length === 3) {
                if (this.selectedResultTable.name === 'KM') {
                    this.plot = this.resultTables[1].plot;
                    this.plot = JSON.parse(this.plot);
                } else if (this.selectedResultTable.name === 'NA') {
                    this.plot = this.resultTables[2].plot;
                    this.plot = JSON.parse(this.plot);
                } else if (this.selectedResultTable.name === 'Pairwise Logrank Test') {
                    this.plot = this.resultTables[1].plot;
                    this.plot = JSON.parse(this.plot);
                }
            } else if (this.project.method === 'cox') {
                this.plot = this.resultTables[0].plot;
                this.plot = JSON.parse(this.plot);
            }

            window.dispatchEvent(new Event('resize'));
        }
    }

    private async refreshTokens() {
        this.tokens = await this.projectService.getTokens(this.project);
    }

    private async refreshTraffic() {
        this.traffic = await this.projectService.getTraffic(this.project);
    }

    private async updateProject(): Promise<void> {
        await this.projectService.updateProject(this.project);
        await this.refresh();
    }

    public hasResults(): boolean {
        return this.resultTables.length > 0;
    }

    public async selectResultTable(table: ResultTable) {
        this.selectedResultTable = table;
        await this.refreshResults();
    }

    public get downloadLink(): string {
        return `${environment.apiUrl}/projects/${this.project.id}/result_table_csv/?tid=${this.selectedResultTable.id}&access_token=${this.apiService.getAccessToken()}`;
    }

    public async runProject() {
        const response = await this.projectService.runProject(this.project);
        if (!response) {
            toastError('Project could not be started. Please check if all created tokens are assigned to a user.');
        } else {
            toastSuccess('Project started.');
            this.project.state = 'running';
            await this.refresh();
            this.trafficVisible = true;

        }
    }

    public downloadSVG() {
        Plotly.downloadImage(this.plot, {format: 'svg'})
            .then((filename: string): void => {
                console.log(filename);
            })
            .catch((): void => {
                console.log('Sorry there was a problem downloading your snapshot!');
            });
    }

    public changeVisibility(section) {
        if (section === 'collab') {
            this.collabVisible = !this.collabVisible;
        }

        if (section === 'traffic') {
            this.trafficVisible = !this.trafficVisible;
        }

        if (section === 'summary') {
            this.summaryVisible = !this.summaryVisible;
        }

        if (section === 'parameters') {
            this.parametersVisible = !this.parametersVisible;
        }

        if (section === 'results') {
            this.resultsVisible = !this.resultsVisible;
        }
    }

    public copyToClipboard(item) {
        document.addEventListener('copy', (e: ClipboardEvent) => {
            e.clipboardData.setData('text/plain', (item));
            e.preventDefault();
            document.removeEventListener('copy', null);
        });
        document.execCommand('copy');
        bulmaToast.toast({message: 'Token copied to clipboard.', type: 'is-success', position: 'center'});

    }

    public getDifferenceInDays(date1, date2) {
        const diffInMs = Math.abs(date2 - date1);
        return diffInMs / (1000 * 60 * 60 * 24);
    }

    public getDifferenceInHours(date1, date2) {
        const diffInMs = Math.abs(date2 - date1);
        return diffInMs / (1000 * 60 * 60);
    }

    public getDifferenceInMinutes(date1, date2) {
        const diffInMs = Math.abs(date2 - date1);
        return diffInMs / (1000 * 60);
    }

    public getDifferenceInSeconds(date1, date2) {
        const diffInMs = Math.abs(date2 - date1);
        return diffInMs / 1000;
    }

    public ConvertStringToNumber(input: string) {

        if (!input) {
            return NaN;
        }

        if (input.trim().length === 0) {
            return NaN;
        }
        return Number(input);
    }

    public async setEpsilon(eps: number) {
        this.epsilon = eps;
        this.project.privacy_level = this.epsilon;
        await this.projectService.updateProject(this.project);
    }
}
