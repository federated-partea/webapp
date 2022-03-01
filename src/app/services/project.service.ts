import {Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {ProjectJson, ProjectModel} from '../models/project.model';
import {TokenJson, TokenModel} from '../models/token.model';
import {environment} from '../../environments/environment';

export interface TrafficLog {
  createdAt: Date;
  size: number;
  direction: 'in' | 'out';
  preview: string;
  state: string;
  step: number;
  tokenId: number;
}

export interface ResultTable {
  id: number;
  name: string;
  p_values: string;
  columns: number[];
  plot: {};
  rowCount: number;
}

export interface ResultRow {
  id: string;
  name: string;
  columns: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private api: ApiService) {
  }

  public async getProjects(): Promise<ProjectModel[]> {
    return await this.api.get<ProjectJson[]>(`/projects/`).then(async (json) => {
      return await Promise.all(json.map(j => this.projectFromJson(j)));
    });
  }

  public async getProject(projId: number): Promise<ProjectModel | null> {
    return await this.api.get<ProjectJson>(`/projects/${projId}/`).then((json) => {
      return this.projectFromJson(json);
    }).catch((() => {
      return null;
    }));
  }

  public async createProject(proj: ProjectJson): Promise<ProjectModel> {
    return await this.api.post<ProjectJson>(`/projects/`, proj).then(async (json) => {
      return await this.projectFromJson(json);
    }).catch((() => {
      return null;
    }));
  }

  public async joinProject(token: string): Promise<ProjectModel> {
    return await this.api.post<ProjectJson>(`/projects/join/`, {token}).then(async (json) => {
      return await this.projectFromJson(json);
    });
  }

  public async deleteProject(proj: ProjectModel): Promise<void> {
    await this.api.delete<ProjectJson>(`/projects/${proj.id}/`);
  }

  public async updateProject(project: ProjectModel) {
    return await this.api.put<ProjectJson>('/projects/' + project.id.toString() + '/', project);
  }

  public async getTokens(proj: ProjectModel): Promise<TokenModel[]> {
    return await this.api.get<TokenJson[]>(`/projects/${proj.id}/tokens/`).then(async (json) => {
      return await Promise.all(json.map(j => this.tokenFromJson(j)));
    });
  }

  public async getTraffic(proj: ProjectModel): Promise<TrafficLog[]> {
    return await this.api.get<any[]>(`/projects/${proj.id}/traffic/`).then(async (json: any[]) => {
      return await Promise.all(json.map(j => ({
        createdAt: new Date(j.created_at),
        direction: j.direction,
        size: j.size,
        preview: j.preview,
        step: j.step,
        state: j.state,
        tokenId: j.token_id,
      })));
    });
  }

  public async createToken(proj: ProjectModel): Promise<TokenModel> {
    return await this.api.post<TokenJson>(`/projects/${proj.id}/create_token/`, {}).then(async (json) => {
      return await this.tokenFromJson(json);
    });
  }

  public async runProject(proj: ProjectModel): Promise<boolean> {
    return await this.api.post<boolean>(`/projects/${proj.id}/run_project/`, {});
  }

  public async deleteToken(token: TokenModel): Promise<void> {
    await this.api.delete<ProjectJson>(`/tokens/${token.id}/`);
  }

  public async getResultTables(proj: ProjectModel): Promise<ResultTable[]> {
    return await this.api.get<any[]>(`/projects/${proj.id}/result_tables/`).then(async (json) => {
      return json.map(tableJson => ({
        id: tableJson.id,
        name: tableJson.name,
        p_values: tableJson.p_values,
        columns: tableJson.columns,
        plot: tableJson.plot,
        rowCount: tableJson.row_count,
      }) as ResultTable);
    });
  }

  public async getResults(proj: ProjectModel, table: ResultTable): Promise<ResultRow[]> {
    return await this.api.get<ResultRow[]>(`/projects/${proj.id}/result_table/?tid=${table.id}`).then(async (json) => {

      return json;
    });
  }

  public async projectFromJson(json: ProjectJson): Promise<ProjectModel> {
    const obj = new ProjectModel();
    await obj.refresh(json);
    return obj;
  }

  public async tokenFromJson(json: TokenJson): Promise<TokenModel> {
    const obj = new TokenModel();
    await obj.refresh(json);
    return obj;
  }

}
