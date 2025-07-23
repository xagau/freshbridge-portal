import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TestimonialCardWidget } from '@/pages/UI-component/landing/components/testimonialcardwidget';

@Component({
    selector: 'app-testimonial-widget',
    standalone: true,
    imports: [CommonModule, TestimonialCardWidget],
    template: `<section class="relative landing-container mx-auto py-10 lg:py-28">
        <div class="badge">Testimonial</div>
        <h2 class="title-h5 lg:title-h2 mt-4">Customer Reviews</h2>
        <p class="body-small lg:body-large mt-4 max-w-md lg:max-w-none mx-auto">Varius morbi enim nunc faucibus a pellentesque sit amet. Lobortis mattis aliquam.</p>

        <div class="lg:overflow-hidden transition-all duration-500 relative z-10">
            <div class="grid grid-cols-1 lg:grid-cols-[26.5%_1fr_26.5%] items-start gap-4 xl:gap-6 mt-16 lg:pt-32 lg:-mt-16 max-w-3xl lg:max-w-none mx-auto">
                <div class="hidden lg:grid grid-cols-1 gap-4 xl:gap-6 order-2 lg:order-1">
                    <div *ngFor="let testimonial of testimonial1; let i = index">
                        <app-testimonial-card-widget [testimonial]="testimonial" />
                    </div>
                </div>

                <div class="grid grid-cols-1 gap-4 xl:gap-6 order-1 lg:order-2">
                    <div class="border border-dashed rounded-2xl border-surface-200 dark:border-surface-800">
                        <app-testimonial-card-widget
                            [testimonial]="{
                                avatar: '/images/avatar/avatar-f-2.png',
                                name: 'Bessie Cooper',
                                title: 'Product Manager',
                                message:
                                    'Justo eget magna fermentum iaculis eu non diam phasellus vestibulum. Sed tempus urna et pharetra pharetra massa massa ultricies. Ut faucibus pulvinar elementum integer enim. Faucibus purus in massa tempor nec.'
                            }"
                            className="bg-surface-0 -rotate-3 dark:bg-surface-950 shadow-[0px_120px_34px_0px_rgba(0,0,0,0.00),0px_77px_31px_0px_rgba(0,0,0,0.01),0px_43px_26px_0px_rgba(0,0,0,0.04),0px_19px_19px_0px_rgba(0,0,0,0.07),0px_5px_11px_0px_rgba(0,0,0,0.08)]"
                        />
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 items-start gap-4 xl:gap-6">
                        <div class="grid grid-cols-1 gap-4 xl:gap-6">
                            <div *ngFor="let testimonial of testimonial2; let i = index">
                                <app-testimonial-card-widget [testimonial]="testimonial" />
                            </div>
                        </div>

                        <div class="grid grid-cols-1 gap-4 xl:gap-6">
                            <div *ngFor="let testimonial of testimonial3; let i = index">
                                <app-testimonial-card-widget [testimonial]="testimonial" />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="hidden lg:grid grid-cols-1 gap-4 xl:gap-6 order-3">
                    <div *ngFor="let testimonial of testimonial4; let i = index">
                        <app-testimonial-card-widget [testimonial]="testimonial" />
                    </div>
                </div>
            </div>
        </div>

        <div class="mx-auto sm:max-w-sm mt-12 lg:hidden">
            <button class="py-3 px-7 w-full rounded-xl bg-surface-950 dark:bg-surface-0 text-surface-0 dark:text-surface-950 hover:opacity-75 transition-all">All Customers Reviews</button>
        </div>

        <div
            class="opacity-100 z-20 hidden lg:block absolute transition-all duration-500 bottom-0 left-0 w-full h-[42rem] [background:linear-gradient(0deg,_#FFF_18.86%,rgba(255,255,255,0.76)_52.08%,rgba(255,255,255,0.36)_67.51%,rgba(255,255,255,0.10)_89.4%,rgba(255,255,255,0.00)_99.94%)] dark:[background:linear-gradient(0deg,var(--p-surface-950)_18.86%,color-mix(in_srgb,var(--p-surface-950)_95%,transparent_5%)_52.08%,color-mix(in_srgb,var(--p-surface-950)_60%,transparent_40%)_65.88%,color-mix(in_srgb,var(--p-surface-950)_30%,transparent_70%)_89.4%,rgba(9,9,11,0.00)_99.94%)]"
        >
            <button class="py-3 px-7 rounded-xl bg-surface-950 dark:bg-surface-0 text-surface-0 dark:text-surface-950 hover:opacity-75 transition-all absolute left-1/2 -translate-x-1/2 bottom-1/3">All Customers Reviews</button>
        </div>
    </section> `
})
export class TestimonialWidget {
    testimonial1 = [
        {
            avatar: '/images/avatar/avatar-f-1.png',
            name: 'Jane Cooper',
            title: 'Product Designer',
            message: 'Orci a scelerisque purus semper eget. Odio eu feugiat pretium nibh ipsum consequat nisl vel. Eu nisl nunc mi ipsum faucibus. Non diam phasellus vestibulum lorem.'
        },
        {
            avatar: '/images/avatar/avatar-f-4.png',
            name: 'Olivia Holt',
            title: 'Product Manager',
            message: 'Magna eget est lorem ipsum dolor. Malesuada fames ac turpis egestas maecenas pharetra convallis.'
        },
        {
            avatar: '/images/avatar/avatar-m-2.png',
            name: 'Robert Fox',
            title: 'Product Designer',
            message: 'Leo vel fringilla est ullamcorper eget nulla facilisi. Ultrices eros in cursus turpis massa tincidunt dui ut. Ultricies mi eget mauris pharetra et ultrices.'
        },
        {
            avatar: '/images/avatar/avatar-m-3.png',
            name: 'Jacob Jones',
            title: 'Product Manager',
            message: 'Nunc consequat interdum varius sit amet mattis vulputate. Praesent semper feugiat nibh sed. Augue neque gravida in fermentum et sollicitudin ac orci phasellus.'
        },
        {
            avatar: '/images/avatar/avatar-f-6.png',
            name: 'Cristina Lean',
            title: 'Product Designer',
            message: 'Varius morbi enim nunc faucibus a pellentesque sit amet. Lobortis mattis aliquam faucibus purus in massa tempor'
        }
    ];

    testimonial2 = [
        {
            avatar: '/images/avatar/avatar-f-5.png',
            name: 'Eleanor Pena',
            title: 'Product Designer',
            message: 'Sapien eget mi proin sed. Ultrices gravida dictum fusce ut placerat. Adipiscing tristique risus nec feugiat in fermentum. Nunc sed blandit libero volutpat. Praesent tristique magna sit amet purus gravida quis.'
        },
        {
            avatar: '/images/avatar/avatar-f-6.png',
            name: 'Cristina Lean',
            title: 'Product Designer',
            message: 'Varius morbi enim nunc faucibus a pellentesque sit amet. Lobortis mattis aliquam faucibus purus in massa tempor'
        },
        {
            avatar: '/images/avatar/avatar-m-2.png',
            name: 'Robert Fox',
            title: 'Product Designer',
            message: 'Leo vel fringilla est ullamcorper eget nulla facilisi. Ultrices eros in cursus turpis massa tincidunt dui ut. Ultricies mi eget mauris pharetra et ultrices.'
        }
    ];

    testimonial3 = [
        {
            avatar: '/images/avatar/avatar-m-1.png',
            name: 'Darrell Steward',
            title: 'Product Manager',
            message: 'Nulla pharetra diam sit amet nisl suscipit adipiscing. Gravida quis blandit turpis cursus.'
        },
        {
            avatar: '/images/avatar/avatar-f-7.png',
            name: 'Wade Warren',
            title: 'Product Designer',
            message: 'Tempus imperdiet nulla malesuada pellentesque elit eget gravida cum. Elit duis tristique sollicitudin nibh sit amet. Proin sed libero enim sed faucibus.Sagittis eu volutpat odio facilisis.'
        },
        {
            avatar: '/images/avatar/avatar-f-3.png',
            name: 'Taylor Jonas',
            title: 'Product Designer',
            message: 'Habitant morbi tristique senectus et netus et malesuada fames ac. Enim lobortis scelerisque fermentum dui faucibus in ornare quam viverra. Faucibus pulvinar elementum integer enim.'
        }
    ];

    testimonial4 = [
        {
            avatar: '/images/avatar/avatar-f-3.png',
            name: 'Taylor Jonas',
            title: 'Product Designer',
            message: 'Habitant morbi tristique senectus et netus et malesuada fames ac. Enim lobortis scelerisque fermentum dui faucibus in ornare quam viverra. Faucibus pulvinar elementum integer enim.'
        },
        {
            avatar: '/images/avatar/avatar-m-2.png',
            name: 'Cole Bemis',
            title: 'Product Manager',
            message:
                'Libero volutpat sed cras ornare arcu dui vivamus arcu. Augue neque gravida in fermentum et sollicitudin ac. Laoreet suspendisse interdum consectetur libero id faucibus nisl tincidunt.Amet cursus sit amet dictum sit amet justo donec. Neque convallis a cras semper auctor.'
        },
        {
            avatar: '/images/avatar/avatar-f-8.png',
            name: 'Emma Stone',
            title: 'Product Designer',
            message: 'Amet dictum sit amet justo. Lacus luctus accumsan tortor posuere ac ut consequat semper viverra. Velit egestas dui id ornare arcu odio ut sem.'
        },
        {
            avatar: '/images/avatar/avatar-m-5.png',
            name: 'Kyra Assaad',
            title: 'Product Manager',
            message: 'Dolor morbi non arcu risus quis varius. Quis imperdiet massa tincidunt nunc pulvinar sapien et. Tellus mauris a diam maecenas.'
        }
    ];
}
