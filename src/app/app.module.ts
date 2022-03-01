import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AccountPageComponent } from './pages/account-page/account-page.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { IndexPageComponent } from './pages/index-page/index-page.component';
import {ArraySortPipe, ProjectsPageComponent} from './pages/projects-page/projects-page.component';
import { ProjectPageComponent } from './pages/project-page/project-page.component';
import { ByteSizePipe } from './pipes/byte-size.pipe';
import { HowToPageComponent } from './pages/how-to-page/how-to-page.component';
import { AboutPageComponent } from './pages/about-page/about-page.component';
import { PlotlyViaCDNModule } from 'angular-plotly.js';
import {ImprintPageComponent} from './pages/imprint-page/imprint-page.component';
import { PrivacyPolicyPageComponent } from './pages/privacy-policy-page/privacy-policy-page.component';

PlotlyViaCDNModule.setPlotlyVersion('latest');

@NgModule({
  declarations: [
    AppComponent,
    AccountPageComponent,
    PageNotFoundComponent,
    IndexPageComponent,
    ImprintPageComponent,
    PrivacyPolicyPageComponent,
    ProjectsPageComponent,
    ProjectPageComponent,
    ByteSizePipe,
    HowToPageComponent,
    AboutPageComponent,
    ArraySortPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    PlotlyViaCDNModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
