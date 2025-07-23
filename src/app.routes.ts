import { Routes } from '@angular/router';
import { AppLayout } from '@/layout/components/app.layout';
import { Notfound } from '@/pages/UI-component/notfound/notfound';
import { LandingLayout } from '@/layout/components/app.landinglayout';
import { AuthLayout } from '@/layout/components/app.authlayout';
import { AuthGuard } from '@/auth/auth.guard';
import { ProfileCompletionGuard } from "@/pages/auth/profile-completion/profile-completion.guard"
import { ProfileCompletionComponent } from "@/pages/auth/profile-completion/profile-completion.component"

export const appRoutes: Routes = [
    {
        path: 'profile-completion',
        component: ProfileCompletionComponent,
        canActivate: [ProfileCompletionGuard]
    },
    {
        path: '',
        component: LandingLayout,
        children: [
            {
                path: '',
                loadComponent: () => import('@/pages/UI-component/landing/landingpage').then((c) => c.LandingPage)
            },
            {
                path: 'features',
                loadComponent: () => import('@/pages/UI-component/landing/featurespage').then((c) => c.FeaturesPage)
            },
            {
                path: 'pricing',
                loadComponent: () => import('@/pages/UI-component/landing/pricingpage').then((c) => c.PricingPage)
            },
            {
                path: 'contact',
                loadComponent: () => import('@/pages/UI-component/landing/contactpage').then((c) => c.ContactPage)
            }
        ]
    },

    {
        path: '',
        component: AppLayout,
        canActivate: [AuthGuard],
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('@/pages/dashboards/dashboard').then((c) => c.EcommerceDashboard),
                data: { breadcrumb: 'Dashboard', roles: ['FARMER', 'RESTAURANT'] }
            },
            {
                path: 'freshselect',
                loadComponent: () => import('@/pages/chat/chat.component').then((c) => c.ChatComponent),
                data: { breadcrumb: 'FreshSelect', roles: ['FARMER', 'RESTAURANT', 'COURIER'] }
            },
            {
                path: 'settings',
                loadComponent: () => import('@/pages/settings/settings.component').then((c) => c.SettingsUser),
                data: { breadcrumb: 'Settings' }
            },
            {
                path: 'order-management',
                loadComponent: () => import('@/pages/order-list/order-list.component').then((c) => c.OrderListComponent),
                data: { breadcrumb: 'Dashboard', roles: ['FARMER', 'RESTAURANT', 'COURIER'] }
            },
            {
                path: 'product-management',
                loadChildren: () => import('@/pages/product/product.route'),
                data: { roles: ['FARMER', 'RESTAURANT'] }
            },
            {
                path: 'farmers-management',
                loadComponent: () => import('@/pages/farmer-managment/farmer-managment').then((c) => c.FarmerList),
                canActivate: [AuthGuard],
                data: { breadcrumb: 'Dashboard', roles: ['ADMIN'] }
            },
            {
                path: 'restaurant-management',
                loadComponent: () => import('@/pages/restaurant-managment/restaurant-management.component').then((c) => c.RestaurantManagementComponent),
                canActivate: [AuthGuard],
                data: { breadcrumb: 'Dashboard', roles: ['ADMIN'] }
            },
            {
                path: 'pi',
                loadChildren: () => import('@/pages/payment-invoice/payment.routes'),
                data: { breadcrumb: 'Dashboard', roles: ['FARMER', 'RESTAURANT'] }
            },
            {
                path: 'schedule-order',
                loadComponent: () => import('@/pages/schedule-order/schedule-order').then((c) => c.ScheduleRepeatOrder),
                data: { breadcrumb: 'Schedule Order', roles: ['ADMIN', 'RESTAURANT'] }
            },
            {
                path: 'analytics',
                loadComponent: () => import('@/pages/analytics/analytics').then((c) => c.AnalyticsComponent),
                data: { breadcrumb: 'Analytics', roles: ['ADMIN'] }
            },
            {
                path: 'accounts-management',
                loadChildren: () => import('@/pages/account-access/usersmanagement.routes'),
                data: { roles: ['ADMIN'] }
            }
        ]
    },

    { path: 'notfound', component: Notfound },
    {
        path: 'auth',
        component: AuthLayout,
        children: [
            {
                path: 'login',
                loadComponent: () => import('@/pages/auth/login/login').then((c) => c.Login)
            },
            {
                path: 'register',
                loadComponent: () => import('@/pages/auth/register/register').then((c) => c.Register)
            },
            {
                path: 'verification',
                loadComponent: () => import('@/pages/auth/verification').then((c) => c.Verification)
            },
            {
                path: 'forgot-password',
                loadComponent: () => import('@/pages/auth/forgotpassword').then((c) => c.ForgotPassword)
            },
            {
                path: 'new-password',
                loadComponent: () => import('@/pages/auth/newpassword').then((c) => c.NewPassword)
            },
            {
                path: 'lock-screen',
                loadComponent: () => import('@/pages/auth/lockscreen').then((c) => c.LockScreen)
            },
            {
                path: 'access',
                loadComponent: () => import('@/pages/auth/access').then((c) => c.Access)
            },
            {
                path: 'oops',
                loadComponent: () => import('@/pages/UI-component/oops/oops').then((c) => c.Oops)
            },
            {
                path: 'error',
                loadComponent: () => import('@/pages/UI-component/notfound/notfound').then((c) => c.Notfound)
            },
            {
                path: 'callback',
                loadComponent: () => import('@/pages/auth/google-callback').then((c) => c.GoogleCallback)
            }
        ]
    },
    { path: '**', redirectTo: '/notfound' }
];
