import {BaseModel, IModelJson} from './base.model';

type StateType = 'pre_start' | 'initialized' | 'running' | 'waiting' | 'finished' | 'error';
type AlgorithmType = 'univariate' | 'cox' | 'rsf';
type TimelineType = 'years' | 'months' | 'weeks' | 'days' | 'none';

export interface ProjectJson extends IModelJson {

  name: string;
  state?: StateType;
  method?: AlgorithmType;
  run_start?: string;
  run_end?: string;
  number_of_sites?: number;
  privacy_level?: number;
  smpc?: boolean;
  from_time?: number;
  to_time?: number;
  step_size?: number;
  max_iters?: number;
  conditions?: string;
  penalizer?: number;
  l1_ratio?: number;
  timeline?: TimelineType;
  master_token?: string;
  c_index?: string;
  error_message?: string;
  roles?: string[];
  token?: string;
  owner_id?: number;
  created_at?: string;
}

export class ProjectModel extends BaseModel<ProjectJson> {

  private _name: string;
  private _state: StateType;
  private _method: AlgorithmType;
  private _run_start: string;
  private _run_end: string;
  private _privacy_level: number;
  private _number_of_sites: number;
  private _smpc: boolean;
  private _from_time: number;
  private _to_time: number;
  private _step_size: number;
  private _max_iters: number;
  private _conditions: string;
  private _penalizer: number;
  private _l1_ratio: number;
  private _timeline: TimelineType;
  private _master_token: string;
  private _c_index: string;
  private _sample_number: number;
  private _error_message: string;
  private _roles: string[];
  private _token: string | null;
  private _ownerId: number;
  private _createdAt: Date;

  constructor() {
    super();
  }

  public async refresh(proj: ProjectJson) {
    this._id = proj.id;
    this._name = proj.name;
    this._method = proj.method;
    this._run_start = proj.run_start;
    this._run_end = proj.run_end;
    this._privacy_level = proj.privacy_level;
    this._number_of_sites = proj.number_of_sites;
    this._smpc = proj.smpc;
    this._from_time = proj.from_time;
    this._to_time = proj.to_time;
    this._step_size = proj.step_size;
    this._max_iters = proj.max_iters;
    this._conditions = proj.conditions;
    this._penalizer = proj.penalizer;
    this._l1_ratio = proj.l1_ratio;
    this._timeline = proj.timeline;
    this._master_token = proj.master_token;
    this._c_index = proj.c_index;
    this._error_message = proj.error_message;
    this._state = proj.state;
    this._roles = proj.roles;
    this._token = proj.token;
    this._ownerId = proj.owner_id;
    this._createdAt = new Date(proj.created_at);
  }

  public get name(): string {
    return this._name;
  }

  public set state(state_type) {
    this._state = state_type;
  }

  public get state(): StateType {
    return this._state;
  }

  public set method(algorithm_type) {
    this._method = algorithm_type;
  }

  public get method(): AlgorithmType {
    return this._method;
  }

  public get run_start(): string {
    return this._run_start;
  }

  public get run_end(): string {
    return this._run_end;
  }

  public set privacy_level(privacy_level) {
    this._privacy_level = privacy_level;
  }

  public get privacy_level(): number {
    return this._privacy_level;
  }

  public set number_of_sites(number_of_sites) {
    this._number_of_sites = number_of_sites;
  }

  public get number_of_sites(): number {
    return this._number_of_sites;
  }

  public set smpc(smpc: boolean) {
    this._smpc = smpc;
  }

  public get smpc(): boolean {
    return this._smpc;
  }

  public set from_time(from_time) {
    this._from_time = from_time;
  }

  public get from_time(): number {
    return this._from_time;
  }

  public set to_time(to_time) {
    this._to_time = to_time;
  }

  public get to_time(): number {
    return this._to_time;
  }

  public set step_size(step_size) {
    this._step_size = step_size;
  }

  public get step_size(): number {
    return this._step_size;
  }

  public set max_iters(max_iters) {
    this._max_iters = max_iters;
  }

  public get max_iters(): number {
    return this._max_iters;
  }

  public get conditions(): string {
    return this._conditions;
  }

  public set conditions(conds) {
    this._conditions = conds;
  }

  public get penalizer(): number {
    return this._penalizer;
  }

  public set penalizer(pen: number) {
    this._penalizer = pen;
  }

  public get l1_ratio(): number {
    return this._l1_ratio;
  }

  public set l1_ratio(l1_ratio: number) {
    this._l1_ratio = l1_ratio;
  }

  public get timeline(): TimelineType {
    return this._timeline;
  }

  public set timeline(time) {
    this._timeline = time;
  }

  public get master_token(): string {
    return this._master_token;
  }

  public get c_index(): string {
    return this._c_index;
  }

  public get sample_number(): number {
    return this._sample_number;
  }

  public get error_message(): string {
    return this._error_message;
  }

  public get roles(): string[] {
    return this._roles;
  }

  public get createdAt(): Date {
    return this._createdAt;
  }

}
