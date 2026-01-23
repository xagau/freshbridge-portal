import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from '@/auth/auth.service';
import { MessageService } from 'primeng/api';
import { ForgotPassword } from './forgotpassword';

describe('ForgotPassword', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ForgotPassword, NoopAnimationsModule, HttpClientTestingModule, RouterTestingModule]
        }).compileComponents();
    });

    it('shows error when email is invalid', () => {
        const fixture = TestBed.createComponent(ForgotPassword);
        fixture.detectChanges();

        const authService = fixture.debugElement.injector.get(AuthService);
        const messageService = fixture.debugElement.injector.get(MessageService);
        const authSpy = spyOn(authService, 'forgotPassword').and.callThrough();
        const messageSpy = spyOn(messageService, 'add');

        const form = fixture.componentInstance.forgotForm;
        form.setValue({ email: '' });

        fixture.componentInstance.onSubmit();

        expect(authSpy).not.toHaveBeenCalled();
        expect(messageSpy).toHaveBeenCalled();
    });

    it('submits valid email and navigates to reset', fakeAsync(() => {
        const fixture = TestBed.createComponent(ForgotPassword);
        fixture.detectChanges();

        const authService = fixture.debugElement.injector.get(AuthService);
        const router = TestBed.inject(Router);
        spyOn(authService, 'forgotPassword').and.returnValue(of(true));
        const routerSpy = spyOn(router, 'navigate').and.resolveTo(true);

        const form = fixture.componentInstance.forgotForm;
        form.setValue({ email: 'test@example.com' });

        fixture.componentInstance.onSubmit();
        tick(1000);

        expect(routerSpy).toHaveBeenCalledWith(['/auth/new-password'], {
            queryParams: { contact: 'test@example.com' }
        });
    }));
});
