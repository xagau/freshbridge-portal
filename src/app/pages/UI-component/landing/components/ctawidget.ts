import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { LayoutService } from '@/layout/service/layout.service';
import { LazyImageWidget } from '@/pages/UI-component/landing/components/lazyimagewidget';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-cta-widget',
    standalone: true,
    imports: [CommonModule, LazyImageWidget, RouterLink],
    template: `
        <section class="py-10 lg:py-28 landing-container mx-auto">
            <div class="relative overflow-hidden pr-8 sm:pr-0 pt-8 sm:pt-16 xl:pt-20 pb-8 sm:pb-20 xl:pb-24 pl-8 sm:pl-12 xl:pl-20 w-full bg-surface-50 dark:bg-surface-900 rounded-2xl flex items-start sm:flex-row flex-col gap-16 sm:gap-8 lg:gap-14">
                <div class="relative z-10 sm:flex-1 lg:max-w-md xl:max-w-[35rem]">
                    <h3 class="title-h5 lg:title-h3 max-w-60 sm:max-w-72 lg:max-w-md !text-left">Now, It's Time to Take Action!</h3>
                    <p class="mt-4 body-small lg:body-large !text-left max-w-sm md:max-w-none">
                        Helping Canadian agriculture move faster, smarter, and greener — one digital connection at a time. Whether you're buying fresh or selling direct, FreshBridge is your new digital partner for field-to-fork logistics.
                    </p>
                    <div class="mt-9 flex items-center gap-4">
                        <a routerLink="/" class="w-full sm:w-fit px-4 py-2 bg-surface-950 hover:bg-surface-700 dark:bg-surface-0 dark:hover:bg-surface-200 rounded-lg body-small text-surface-0 dark:text-surface-950 transition-all"> Get Started </a>
                        <a
                            routerLink="/"
                            class="w-full sm:w-fit flex items-center justify-center gap-2 px-4 py-2 rounded-lg body-small text-surface-950 dark:text-surface-0 border border-surface-200 dark:border-surface-800 hover:bg-surface-100 dark:hover:bg-surface-800 transition-all"
                        >
                            Learn More
                            <i class="pi pi-arrow-right text-sm"></i>
                        </a>
                    </div>
                </div>
                <div class="relative sm:flex-1 h-[14rem] ml-6">
                    <svg class="absolute -top-6 -left-6" width="561" height="391" viewBox="0 0 561 391" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0_2001_1100)">
                            <g clip-path="url(#clip1_2001_1100)">
                                <path d="M-505 204.808L493.796 1411.61" class="stroke-surface-200 dark:stroke-surface-800" />
                                <path d="M-488.822 191.418L509.974 1398.22" class="stroke-surface-200 dark:stroke-surface-800" />
                                <path d="M-472.644 178.029L526.152 1384.83" class="stroke-surface-200 dark:stroke-surface-800" />
                                <path d="M-456.466 164.639L542.329 1371.44" class="stroke-surface-200 dark:stroke-surface-800" />
                                <path d="M-440.289 151.25L558.507 1358.05" class="stroke-surface-200 dark:stroke-surface-800" />
                                <path d="M-424.111 137.86L574.685 1344.66" class="stroke-surface-200 dark:stroke-surface-800" />
                                <path d="M-407.933 124.471L590.863 1331.27" class="stroke-surface-200 dark:stroke-surface-800" />
                                <path d="M-391.755 111.082L607.041 1317.88" class="stroke-surface-200 dark:stroke-surface-800" />
                                <path d="M-375.577 97.6924L623.219 1304.5" class="stroke-surface-200 dark:stroke-surface-800" />
                                <path d="M-359.399 84.3027L639.397 1291.11" class="stroke-surface-200 dark:stroke-surface-800" />
                                <path d="M-343.221 70.9136L655.575 1277.72" class="stroke-surface-200 dark:stroke-surface-800" />
                                <path d="M-327.043 57.5239L671.752 1264.33" class="stroke-surface-200 dark:stroke-surface-800" />
                                <path d="M-310.866 44.1348L687.93 1250.94" class="stroke-surface-200 dark:stroke-surface-800" />
                                <path d="M-294.688 30.7451L704.108 1237.55" class="stroke-surface-200 dark:stroke-surface-800" />
                                <path d="M-278.51 17.356L720.286 1224.16" class="stroke-surface-200 dark:stroke-surface-800" />
                                <path d="M-262.332 3.96631L736.464 1210.77" class="stroke-surface-200 dark:stroke-surface-800" />
                                <path d="M-246.154 -9.42334L752.642 1197.38" class="stroke-surface-200 dark:stroke-surface-800" />
                                <path d="M-229.976 -22.8125L768.82 1183.99" class="stroke-surface-200 dark:stroke-surface-800" />
                                <path d="M-213.798 -36.2021L784.997 1170.6" class="stroke-surface-200 dark:stroke-surface-800" />
                                <path d="M-197.62 -49.5913L801.175 1157.21" class="stroke-surface-200 dark:stroke-surface-800" />
                                <path d="M-181.443 -62.981L817.353 1143.82" class="stroke-surface-200 dark:stroke-surface-800" />
                                <path d="M-165.265 -76.3701L833.531 1130.43" class="stroke-surface-200 dark:stroke-surface-800" />
                                <path d="M-149.087 -89.7598L849.709 1117.04" class="stroke-surface-200 dark:stroke-surface-800" />
                                <path d="M-132.909 -103.149L865.887 1103.65" class="stroke-surface-200 dark:stroke-surface-800" />
                                <path d="M-116.731 -116.539L882.065 1090.26" class="stroke-surface-200 dark:stroke-surface-800" />
                                <path d="M-100.553 -129.928L898.243 1076.87" class="stroke-surface-200 dark:stroke-surface-800" />
                                <path d="M-84.3754 -143.317L914.42 1063.49" class="stroke-surface-200 dark:stroke-surface-800" />
                                <path d="M-68.1976 -156.707L930.598 1050.1" class="stroke-surface-200 dark:stroke-surface-800" />
                                <path d="M-52.0197 -170.096L946.776 1036.71" class="stroke-surface-200 dark:stroke-surface-800" />
                                <path d="M-35.8419 -183.485L962.954 1023.32" class="stroke-surface-200 dark:stroke-surface-800" />
                                <path d="M-19.6639 -196.875L979.132 1009.93" class="stroke-surface-200 dark:stroke-surface-800" />
                                <path d="M-3.48608 -210.264L995.31 996.539" class="stroke-surface-200 dark:stroke-surface-800" />
                                <path d="M12.6918 -223.654L1011.49 983.149" class="stroke-surface-200 dark:stroke-surface-800" />
                                <path d="M28.8696 -237.043L1027.67 969.759" class="stroke-surface-200 dark:stroke-surface-800" />
                                <path d="M45.0475 -250.433L1043.84 956.37" class="stroke-surface-200 dark:stroke-surface-800" />
                                <path d="M61.2253 -263.822L1060.02 942.98" class="stroke-surface-200 dark:stroke-surface-800" />
                                <path d="M77.4033 -277.211L1076.2 929.591" class="stroke-surface-200 dark:stroke-surface-800" />
                                <path d="M93.5811 -290.601L1092.38 916.202" class="stroke-surface-200 dark:stroke-surface-800" />
                                <path d="M109.759 -303.99L1108.55 902.812" class="stroke-surface-200 dark:stroke-surface-800" />
                                <path d="M125.937 -317.38L1124.73 889.423" class="stroke-surface-200 dark:stroke-surface-800" />
                                <path d="M142.115 -330.769L1140.91 876.034" class="stroke-surface-200 dark:stroke-surface-800" />
                                <path d="M158.293 -344.159L1157.09 862.644" class="stroke-surface-200 dark:stroke-surface-800" />
                                <path d="M174.47 -357.548L1173.27 849.255" class="stroke-surface-200 dark:stroke-surface-800" />
                                <path d="M190.648 -370.938L1189.44 835.865" class="stroke-surface-200 dark:stroke-surface-800" />
                                <path d="M206.826 -384.327L1205.62 822.476" class="stroke-surface-200 dark:stroke-surface-800" />
                                <path d="M223.004 -397.716L1221.8 809.086" class="stroke-surface-200 dark:stroke-surface-800" />
                                <path d="M239.182 -411.105L1237.98 795.697" class="stroke-surface-200 dark:stroke-surface-800" />
                                <path d="M255.36 -424.495L1254.16 782.308" class="stroke-surface-200 dark:stroke-surface-800" />
                                <path d="M271.538 -437.885L1270.33 768.918" class="stroke-surface-200 dark:stroke-surface-800" />
                                <path d="M287.716 -451.274L1286.51 755.529" class="stroke-surface-200 dark:stroke-surface-800" />
                                <path d="M303.893 -464.664L1302.69 742.139" class="stroke-surface-200 dark:stroke-surface-800" />
                                <path d="M320.071 -478.053L1318.87 728.75" class="stroke-surface-200 dark:stroke-surface-800" />
                                <path d="M336.249 -491.442L1335.05 715.36" class="stroke-surface-200 dark:stroke-surface-800" />
                                <path d="M352.427 -504.832L1351.22 701.971" class="stroke-surface-200 dark:stroke-surface-800" />
                                <path d="M368.605 -518.221L1367.4 688.581" class="stroke-surface-200 dark:stroke-surface-800" />
                                <path d="M384.783 -531.61L1383.58 675.192" class="stroke-surface-200 dark:stroke-surface-800" />
                                <path d="M400.961 -545L1399.76 661.803" class="stroke-surface-200 dark:stroke-surface-800" />
                            </g>
                        </g>
                        <rect x="0.5" y="0.5" width="726" height="722" rx="24.5" class="stroke-surface-200 dark:stroke-surface-800" />
                        <defs>
                            <clipPath id="clip0_2001_1100">
                                <rect x="1" y="1" width="725" height="721" rx="24" fill="white" />
                            </clipPath>
                            <clipPath id="clip1_2001_1100">
                                <rect width="1176" height="1566.51" fill="white" transform="translate(-505 204.808) rotate(-39.6125)" />
                            </clipPath>
                        </defs>
                    </svg>
                    <app-lazy-image-widget
                        [src]="'/images/landing/' + (isDarkTheme() ? 'cta-dashboard-dark.png' : 'now-action.png')"
                        alt="CTA Image"
                        className="absolute top-0 left-0 w-[38rem] lg:w-[40rem] h-auto rounded-2xl shadow-[0px_3.267px_13.068px_0px_rgba(18,18,23,0.08),0px_0px_0px_1px_#E3E8EF] dark:shadow-[0px_2.668px_10.673px_0px_rgba(18,18,23,0.08),0px_0px_0px_0.817px_#27272A]"
                        style="display: contents;"
                    />
                </div>
                <svg class="w-28 absolute -top-6 right-0 rotate-180 sm:rotate-0 sm:top-auto sm:-bottom-0 sm:-left-0" xmlns="http://www.w3.org/2000/svg" width="152" height="165" viewBox="0 0 152 165" fill="none">
                    <path
                        d="M135.034 84.176L69.4652 121.968M-89.9079 213.824V194.664V103.336L-74.4765 112.222M-89.9079 213.824L-74.4765 204.944V204.847L5.9441 158.534M-89.9079 213.824L5.94447 269.07V251.307M22.5633 149V278.648V260.888V149ZM22.5633 149L69.4652 121.968M22.5633 149L62.1262 126.192M119.603 93.056L62.1262 126.192M22.5006 1L5.94447 10.5392L-105.933 75M22.5006 1L39.0568 10.5392L150.934 75M22.5006 1V1.07641M150.934 75L150.901 75.0192M150.934 75V75.0755M22.5006 297L5.94447 287.461L-105.933 223V222.962M22.5006 297L39.0568 287.461L150.934 223V222.962M22.5006 297V296.924M-105.933 75L-105.9 75.0188M-105.933 75V75.0384M22.5006 149L-105.9 75.0188M22.5006 149L23.4608 148.447M22.5006 149V152.654M151 74.9999L134.44 65.4681L22.5332 1.05694M151 74.9999L150.996 94.071L150.967 222.943L150.934 222.962M151 74.9999L23.4608 148.447M22.5332 1.05694L22.5 1.07604M22.5332 1.05694L22.5332 1.09514M22.5328 296.943L134.439 232.532L151 223L150.995 203.929L150.967 75.0569M22.5328 296.943L22.5328 296.905M22.5328 296.943L22.5 296.924M-106 74.9999L-105.967 222.943L-105.933 222.962M-106 74.9999L22.4668 1.05693L22.5 1.07604M-106 74.9999L-105.933 75.0384M150.967 75.0569L150.901 75.0192M150.967 75.0569L150.934 75.0755M22.4998 149L23.4608 148.447M22.4998 149L22.5006 152.654M22.4998 149L-105.933 75.0384M103.077 83.5288L39.0568 46.6206V120.397M103.077 83.5288L39.0568 120.397M103.077 83.5288L118.501 74.6467L22.5633 19.352L22.5291 19.3717M39.0568 120.397L22.5048 129.929M-58.014 83.5653L5.94447 46.6929V120.397M-58.014 83.5653L5.94447 120.397M-58.014 83.5653L-73.4376 74.6832L22.5006 19.3881M5.94447 120.397L22.5 129.931L22.5006 129.931M-74.4765 112.222V185.778L-10.6123 149M-74.4765 112.222L-10.6123 149M-10.6123 149L5.9441 158.534M5.94447 251.307L-58.014 214.435L5.94447 177.603M5.94447 251.307V177.603M5.94447 177.603L5.9441 158.534M39.0568 251.379L103.077 214.471L39.0568 177.603M39.0568 251.379V177.603M39.0568 251.379V269.142L135.034 213.824V213.772M39.0568 177.603L39.0607 158.532M119.603 112.149V185.851L55.6124 149M119.603 112.149L55.6124 149M119.603 112.149L135.034 103.263V194.737V213.772M55.6124 149L39.0607 158.532M22.5006 19.3881V129.931M22.5006 19.3881L22.5291 19.3717M22.5006 19.3881V1.07641M22.5006 129.931L22.5048 129.929M22.5291 19.3717L22.5048 129.929M22.5291 19.3717L22.5332 1.09514M39.0607 158.532L135.034 213.772M23.4608 148.447L150.901 75.0192M23.4608 148.447L62.1262 126.192M150.901 75.0192L22.5332 1.09514M22.5332 1.09514L22.5006 1.07641M22.5006 1.07641L22.5 1.07604M22.5 1.07604L-105.9 75.0188M-105.9 75.0188L-105.967 75.0569L-106 223L22.4671 296.943L22.5 296.924M69.4652 121.968L150.934 75.0755M69.4652 121.968L62.1262 126.192M22.5006 152.654L22.5328 296.905M22.5006 152.654V296.924M22.5328 296.905L150.934 222.962M22.5328 296.905L22.5006 296.924M150.934 222.962V75.0755M-105.933 75.0384V222.962M-105.933 222.962L22.5 296.924M22.5 296.924L22.5006 296.924"
                        class="stroke-surface-200 dark:stroke-surface-700"
                        stroke-width="0.5"
                        stroke-linejoin="round"
                    />
                </svg>
            </div>
        </section>
    `
})
export class CtaWidget {
    layoutService = inject(LayoutService);

    isDarkTheme = computed(() => this.layoutService.isDarkTheme());
}
