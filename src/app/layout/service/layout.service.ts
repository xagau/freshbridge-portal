import { computed, effect, Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';

export interface layoutConfig {
    preset: string;
    primary: string;
    surface: string | undefined | null;
    darkTheme: boolean;
    menuMode: string;
    menuTheme: string;
    cardStyle: string;
}

interface LayoutState {
    staticMenuDesktopInactive?: boolean;
    overlayMenuActive?: boolean;
    configSidebarVisible: boolean;
    staticMenuMobileActive?: boolean;
    menuHoverActive?: boolean;
    sidebarActive: boolean;
    anchored: boolean;
    overlaySubmenuActive: boolean;
    rightMenuVisible: boolean;
    shipmentVisible: boolean;
    searchBarActive: boolean;
}

interface MenuChangeEvent {
    key: string;
    routeEvent?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class LayoutService {
    _config: layoutConfig = {
        preset: 'Aura',
        primary: 'green',
        surface: null,
        darkTheme: false,
        menuMode: 'drawer',
        menuTheme: 'dark',
        cardStyle: 'transparent'
    };

    _state: LayoutState = {
        staticMenuDesktopInactive: false,
        overlayMenuActive: false,
        rightMenuVisible: false,
        shipmentVisible: false,
        configSidebarVisible: false,
        staticMenuMobileActive: false,
        menuHoverActive: false,
        searchBarActive: false,
        sidebarActive: false,
        anchored: false,
        overlaySubmenuActive: false
    };

    layoutConfig = signal<layoutConfig>(this._config);

    layoutState = signal<LayoutState>(this._state);

    private configUpdate = new Subject<layoutConfig>();

    private overlayOpen = new Subject<any>();

    private menuSource = new Subject<MenuChangeEvent>();

    private resetSource = new Subject();

    menuSource$ = this.menuSource.asObservable();

    resetSource$ = this.resetSource.asObservable();

    configUpdate$ = this.configUpdate.asObservable();

    overlayOpen$ = this.overlayOpen.asObservable();

    isDarkTheme = computed(() => this.layoutConfig().darkTheme);

    isSidebarActive = computed(() => this.layoutState().overlayMenuActive || this.layoutState().staticMenuMobileActive || this.layoutState().overlaySubmenuActive);

    isSlim = computed(() => this.layoutConfig().menuMode === 'slim');

    isHorizontal = computed(() => this.layoutConfig().menuMode === 'horizontal');

    isOverlay = computed(() => this.layoutConfig().menuMode === 'overlay');

    isCompact = computed(() => this.layoutConfig().menuMode === 'compact');

    isStatic = computed(() => this.layoutConfig().menuMode === 'static');

    isReveal = computed(() => this.layoutConfig().menuMode === 'reveal');

    isDrawer = computed(() => this.layoutConfig().menuMode === 'drawer');

    transitionComplete = signal<boolean>(false);

    isSidebarStateChanged = computed(() => {
        const layoutConfig = this.layoutConfig();
        return layoutConfig.menuMode === 'horizontal' || layoutConfig.menuMode === 'slim' || layoutConfig.menuMode === 'slim-plus';
    });

    private initialized = false;

    constructor() {
        effect(() => {
            const config = this.layoutConfig();
            if (config) {
                this.onConfigUpdate();
            }
        });

        effect(() => {
            const config = this.layoutConfig();

            if (!this.initialized || !config) {
                this.initialized = true;
                return;
            }

            this.handleDarkModeTransition(config);
        });

        effect(() => {
            this.isSidebarStateChanged() && this.reset();
        });
    }

    private handleDarkModeTransition(config: layoutConfig): void {
        const supportsViewTransition = 'startViewTransition' in document;

        if (supportsViewTransition) {
            this.startViewTransition(config);
        } else {
            this.toggleDarkMode(config);
            this.onTransitionEnd();
        }
    }

    private startViewTransition(config: layoutConfig): void {
        const transition = (document as any).startViewTransition(() => {
            this.toggleDarkMode(config);
        });

        transition.ready
            .then(() => {
                this.onTransitionEnd();
            })
            .catch(() => { });
    }

    toggleDarkMode(config?: layoutConfig): void {
        const _config = config || this.layoutConfig();
        if (_config.darkTheme) {
            document.documentElement.classList.add('app-dark');
        } else {
            document.documentElement.classList.remove('app-dark');
        }
    }

    private onTransitionEnd() {
        this.transitionComplete.set(true);
        setTimeout(() => {
            this.transitionComplete.set(false);
        });
    }

    toggleConfigSidebar() {
        if (this.isSidebarActive()) {
            this.updateLayoutState({
                overlayMenuActive: false,
                overlaySubmenuActive: false,
                staticMenuMobileActive: false,
                menuHoverActive: false,
                configSidebarVisible: false
            });
        }
        this.updateLayoutState({
            configSidebarVisible: true
        });
    }

    updateLayoutState(newState: Partial<any>) {
        this.layoutState.update((prev) => ({
            ...prev,
            ...newState
        }));
    }

    onMenuToggle() {
        if (this.isOverlay()) {
            this.updateLayoutState({ overlayMenuActive: !this.layoutState().overlayMenuActive });

            if (this.layoutState().overlayMenuActive) {
                this.overlayOpen.next(null);
            }
        }

        if (this.isDesktop()) {
            this.updateLayoutState({ staticMenuDesktopInactive: !this.layoutState().staticMenuDesktopInactive });
        } else {
            this.updateLayoutState({ staticMenuMobileActive: !this.layoutState().staticMenuMobileActive });

            if (this.layoutState().staticMenuMobileActive) {
                this.overlayOpen.next(null);
            }
        }
    }
    onConfigUpdate() {
        this._config = { ...this.layoutConfig() };
        this.configUpdate.next(this.layoutConfig());
    }

    onMenuStateChange(event: MenuChangeEvent) {
        this.menuSource.next(event);
    }

    reset() {
        this.resetSource.next(true);
    }

    onOverlaySubmenuOpen() {
        this.overlayOpen.next(null);
    }

    showProfileSidebar() {
        this.updateLayoutState({ profileSidebarVisible: true });
    }

    showConfigSidebar() {
        this.updateLayoutState({ configSidebarVisible: true });
    }

    hideConfigSidebar() {
        this.updateLayoutState({ configSidebarVisible: false });
    }

    toggleRightMenu() {
        this.updateLayoutState({ rightMenuVisible: !this.layoutState().rightMenuVisible });
    }

    // toggle for Shipment View
    toggleShipmentView() {
        console.log("test");

        this.updateLayoutState({ shipmentVisible: !this.layoutState().shipmentVisible });
    }

    isDesktop() {
        return window.innerWidth > 991;
    }

    isMobile() {
        return !this.isDesktop();
    }
}
