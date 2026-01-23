import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Login } from './login';

describe('Login', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Login, NoopAnimationsModule, HttpClientTestingModule, RouterTestingModule]
        }).compileComponents();
    });

    it('toggles password visibility and icon', () => {
        const fixture = TestBed.createComponent(Login);
        fixture.detectChanges();

        const inputEl = fixture.debugElement.query(By.css('input[formControlName="password"]'))
            .nativeElement as HTMLInputElement;
        const iconEl = fixture.debugElement.query(By.css('i')).nativeElement as HTMLElement;
        const toggleButton = fixture.debugElement.query(By.css('button[type="button"]'))
            .nativeElement as HTMLButtonElement;

        expect(inputEl.type).toBe('password');
        expect(iconEl.className).toBe('pi pi-eye');

        toggleButton.click();
        fixture.detectChanges();

        expect(inputEl.type).toBe('text');
        expect(iconEl.className).toBe('pi pi-eye-slash');
    });
});
