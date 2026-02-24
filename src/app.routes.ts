import { Routes } from '@angular/router';
import { AppLayout } from '@/layout/components/app.layout';
import { Notfound } from '@/pages/components/notfound/notfound';
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
                loadComponent: () => import('@/pages/components/landing/landingpage').then((c) => c.LandingPage)
            },
            {
                path: 'features',
                loadComponent: () => import('@/pages/components/landing/featurespage').then((c) => c.FeaturesPage)
            },
            {
                path: 'pricing',
                loadComponent: () => import('@/pages/components/landing/pricingpage').then((c) => c.PricingPage)
            },
            {
                path: 'contact',
                loadComponent: () => import('@/pages/components/landing/contactpage').then((c) => c.ContactPage)
            },
            {
                path: 'terms-and-conditions',
                loadComponent: () => import('@/pages/components/terms-and-conditions/terms-and-conditions').then((c) => c.TermsAndConditions)
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
                data: { breadcrumb: 'Dashboard', roles: ['MERCHANT', 'BUYER'] }
            },
            {
                path: 'freshselect',
                loadComponent: () => import('@/pages/chat/chat.component').then((c) => c.ChatComponent),
                data: { breadcrumb: 'FreshSelect', roles: ['MERCHANT', 'BUYER', 'COURIER'] }
            },
            {
                path: 'profile',
                loadComponent: () => import('@/pages/profile/profile.component').then((c) => c.ProfileUser),
                data: { breadcrumb: 'Profile' }
            },
            {
                path: 'settings-security',
                loadComponent: () => import('@/pages/profile/settings-security.component').then((c) => c.SettingsSecurityComponent),
                data: { breadcrumb: 'Settings Security' }
            },
            {
                path: 'order-management',
                loadComponent: () => import('@/pages/order-list/order-list.component').then((c) => c.OrderListComponent),
                data: { breadcrumb: 'Dashboard', roles: ['MERCHANT', 'BUYER', 'COURIER'] }
            },
            {
                path: 'product-management',
                loadChildren: () => import('@/pages/product/product.route'),
                data: { roles: ['MERCHANT', 'BUYER'] }
            },
            {
                path: 'merchants-management',
                loadComponent: () => import('@/pages/merchant-managment/merchant-managment').then((c) => c.MerchantList),
                canActivate: [AuthGuard],
                data: { breadcrumb: 'Dashboard', roles: ['ADMIN'] }
            },
            {
                path: 'buyers-management',
                loadComponent: () => import('@/pages/buyer-managment/buyer-management.component').then((c) => c.BuyerManagementComponent),
                canActivate: [AuthGuard],
                data: { breadcrumb: 'Dashboard', roles: ['ADMIN'] }
            },
            {
                path: 'pi',
                loadChildren: () => import('@/pages/payment-invoice/payment.routes'),
                data: { breadcrumb: 'Dashboard', roles: ['MERCHANT', 'BUYER', 'ADMIN'] }
            },
            {
                path: 'schedule-order',
                loadComponent: () => import('@/pages/schedule-order/schedule-order').then((c) => c.ScheduleRepeatOrder),
                data: { breadcrumb: 'Schedule Order', roles: ['ADMIN', 'BUYER'] }
            },
            {
                path: 'notifications',
                loadComponent: () => import('@/pages/notifications/notifications.component').then((c) => c.NotificationsPageComponent),
                data: { breadcrumb: '', roles: ['MERCHANT', 'BUYER'] }
            },
            {
                path: 'analytics',
                loadComponent: () => import('@/pages/analytics/analytics').then((c) => c.AnalyticsComponent),
                data: { breadcrumb: 'Analytics', roles: ['ADMIN'] }
            },
            {
                path: 'audit-logs',
                loadComponent: () => import('@/pages/audit-logs/audit-logs.component').then((c) => c.AuditLogsComponent),
                canActivate: [AuthGuard],
                data: { breadcrumb: 'Audit Logs', roles: ['ADMIN'] }
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
                loadComponent: () => import('@/pages/components/oops/oops').then((c) => c.Oops)
            },
            {
                path: 'error',
                loadComponent: () => import('@/pages/components/notfound/notfound').then((c) => c.Notfound)
            },
            {
                path: 'callback',
                loadComponent: () => import('@/pages/auth/google-callback').then((c) => c.GoogleCallback)
            },
            {
                path: 'create-account',
                loadComponent: () => import('@/pages/auth/create-account/create-account.component').then((c) => c.CreateAccountComponent)
            }
        ]
    },
    { path: '**', redirectTo: '/notfound' }
];
