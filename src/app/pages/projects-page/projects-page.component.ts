import {Component, OnInit} from '@angular/core';
import {ProjectJson, ProjectModel} from '../../models/project.model';
import {ProjectService} from '../../services/project.service';
import {Router} from '@angular/router';
import {UserService} from '../../services/user.service';
import {toastError} from '../../../notifications';

import {Pipe, PipeTransform} from '@angular/core';
import {environment} from '../../../environments/environment';
import {ApiService} from '../../services/api.service';

@Pipe({
  name: 'sort'
})
export class ArraySortPipe implements PipeTransform {
  transform(array: any, field: string): any[] {
    if (!Array.isArray(array)) {
      return;
    }
    array.sort((a: any, b: any) => {
      if (a[field] < b[field]) {
        return -1;
      } else if (a[field] > b[field]) {
        return 1;
      } else {
        return 0;
      }
    });
    return array;
  }
}

@Component({
  selector: 'app-projects-page',
  templateUrl: './projects-page.component.html',
  styleUrls: ['./projects-page.component.scss']
})
export class ProjectsPageComponent implements OnInit {

  private interval: any = null;
  public projects: ProjectModel[] = [];
  public newProject: ProjectJson = {
    name: '',
  };

  constructor(private router: Router,
              private apiService: ApiService,
              private projectService: ProjectService,
              public userService: UserService) {
    this.resetNewProject();

  }

  async ngOnInit() {
    await this.refreshProjects();
    this.interval = setInterval(async () => {
      await this.refreshProjects();
    }, 30000);
  }

  public async createProject() {
    const project = await this.projectService.createProject(this.newProject);
    if (!project) {
      toastError('Project could not be created. Are you logged in?');
    }
    await this.router.navigate(['/project', project.id]);
  }

  public async deleteProject(project: ProjectModel) {
    const response = await this.projectService.deleteProject(project);
    await this.refreshProjects();
  }

  public haveRole(project: ProjectModel, role: string): boolean {
    if (!project) {
      return false;
    }
    return project.roles.indexOf(role) !== -1;
  }

  private async refreshProjects() {

    this.projects = await this.projectService.getProjects();
  }

  private resetNewProject() {
    this.newProject.name = '';
  }

  trackByFn(index, item) {
    return item.id; // unique id corresponding to the item
  }

  public async downloadResults(project): Promise<void> {
    const resultTables = await this.projectService.getResultTables(project);
    window.open(`${environment.apiUrl}/projects/${project.id}/result_table_csv/?tid=${resultTables[0].id}&access_token=${this.apiService.getAccessToken()}`);
  }
}



