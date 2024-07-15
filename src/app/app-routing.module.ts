import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountPageComponent } from './pages/account-page/account-page.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { IndexPageComponent } from './pages/index-page/index-page.component';
import { ProjectsPageComponent } from './pages/projects-page/projects-page.component';
import { ProjectPageComponent } from './pages/project-page/project-page.component';
import { HowToPageComponent } from './pages/how-to-page/how-to-page.component';
import {AboutPageComponent} from './pages/about-page/about-page.component';
import { PrivacyPolicyPageComponent } from './pages/privacy-policy-page/privacy-policy-page.component';
import {ImprintPageComponent} from './pages/imprint-page/imprint-page.component';

const routes: Routes = [
  { path: '', component: IndexPageComponent },
  { path: 'account', component: AccountPageComponent },
  { path: 'projects', component: ProjectsPageComponent },
  { path: 'how-to', component: HowToPageComponent },
  { path: 'about', component: AboutPageComponent },
  { path: 'privacy-policy', component: PrivacyPolicyPageComponent },
  { path: 'imprint', component: ImprintPageComponent },
  { path: 'project/:project_id', component: ProjectPageComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
