import {
  NgModule
} from '@angular/core';
import {
  RouterModule,
  Routes
} from '@angular/router';
import {
  TabsPage
} from './tabs.page';
import {
  redirectUnauthorizedTo,
  canActivate
} from '@angular/fire/auth-guard';
import { AuthGuard } from '../route-guards/auth.guard';
const redirectToLogin = redirectUnauthorizedTo(['login']);


const routes: Routes = [{
    path: 'tabs',
    component: TabsPage,
    children: [{
        path: 'home',
        children: [{
          path: '',
          loadChildren: () =>
            import('./home/home.module').then(m => m.HomePageModule)
        }],
        //Angular Fire Login Guard
        ...canActivate(redirectToLogin)
      },
      {
        path: 'tab2',
        children: [{
          path: '',
          loadChildren: () =>
            import('../tab2/tab2.module').then(m => m.Tab2PageModule)
        }],
        //Angular Fire Login Guard
        ...canActivate(redirectToLogin)
      },
      {
        path: 'tab3',
        children: [{
          path: '',
          loadChildren: () =>
            import('../tab3/tab3.module').then(m => m.Tab3PageModule)
        }],
        //Angular Fire Login Guard
        ...canActivate(redirectToLogin)
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}