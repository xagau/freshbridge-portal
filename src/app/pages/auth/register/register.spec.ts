import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Register } from './register';

describe('Register', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Register, NoopAnimationsModule, HttpClientTestingModule, RouterTestingModule]
        }).compileComponents();
    });

    it('toggles password visibility and icon', () => {
        const fixture = TestBed.createComponent(Register);
        fixture.detectChanges();

        const inputEl = fixture.debugElement.query(By.css('input[formControlName="password"]'))
            .nativeElement as HTMLInputElement;
        const passwordContainer = inputEl.parentElement as HTMLElement;
        const toggleButton = passwordContainer.querySelector('button') as HTMLButtonElement;
        const iconEl = passwordContainer.querySelector('i') as HTMLElement;

        expect(inputEl.type).toBe('password');
        expect(iconEl.className).toBe('pi pi-eye');

        toggleButton.click();
        fixture.detectChanges();

        expect(inputEl.type).toBe('text');
        expect(iconEl.className).toBe('pi pi-eye-slash');
    });
});
