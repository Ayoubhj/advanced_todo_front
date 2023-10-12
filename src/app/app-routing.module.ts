import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './main/components/dashboard/dashboard.component';
import { AuthGuard } from './helper/auth.guard';
import { LoginComponent } from './main/components/login/login.component';
import { NotFoundComponent } from './main/components/not-found/not-found.component';
import { TodoComponent } from './main/components/todo/todo.component';
import { ProfileComponent } from './main/components/profile/profile.component';

const routes: Routes = [

  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "tasks",
        component: TodoComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "profile",
        component: ProfileComponent,
        canActivate: [AuthGuard],
      },
    ]
  },

  {
    path: "",
    pathMatch: 'full',
    component: LoginComponent,
  },
  {
    path: "**",
    component: NotFoundComponent,
  }

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule { }
