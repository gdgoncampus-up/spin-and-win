import type {CSSProperties} from 'react';
import type {Category, WheelState} from '../types';
import {Glyph} from './Glyph';

interface ChallengePanelProps {
    categories: readonly Category[];
    state: WheelState;
    onSpin: () => void;
}

export function ChallengePanel({categories, state, onSpin}: ChallengePanelProps) {
    const selected = state.status === 'winner' && state.winnerIndex !== null
        ? categories[state.winnerIndex] : undefined;
    const spinning = state.status === 'spinning';
    const iconStyle = selected ? {
        background: `color-mix(in srgb, ${selected.color} 18%, transparent)`,
        borderColor: `color-mix(in srgb, ${selected.color} 45%, transparent)`,
        color: selected.color,
    } : undefined;

    return (
        <div
            className="my-0 min-h-113.75 rounded-[27px] border border-white/12 bg-[linear-gradient(145deg,rgba(24,33,56,.94),rgba(12,19,36,.97))] p-8 shadow-[0_21px_70px_rgba(0,0,0,.25),inset_0_1px_0_rgba(255,255,255,.065)] max-[900px]:mx-auto max-[900px]:mt-1 max-[900px]:mb-2.5 max-[900px]:min-h-0 max-[900px]:w-[min(100%,570px)] max-[570px]:rounded-[21px] max-[570px]:p-[23px_20px] kiosk:m-0 kiosk:flex kiosk:h-full desktop:h-auto desktop:min-h-127.5 touch-landscape:h-auto touch-landscape:min-h-[min(290px,100%)] kiosk:w-full kiosk:min-h-0 kiosk:flex-col kiosk:overflow-hidden kiosk:rounded-[22px] kiosk:p-[clamp(14px,2.2dvh,27px)] portrait-tab:mx-auto portrait-tab:my-0 portrait-tab:flex portrait-tab:h-full portrait-tab:w-[min(100%,570px)] portrait-tab:min-h-0 portrait-tab:flex-col portrait-tab:overflow-hidden portrait-tab:rounded-[18px] portrait-tab:p-[13px_20px] short:rounded-[18px] short:p-[13px_17px]">
            <div
                className="flex items-center justify-between gap-2.5 text-[11px] font-[850] tracking-[.2em] text-[#a6b4d1] uppercase kiosk:shrink-0 kiosk:text-[10px] portrait-tab:text-[10px]">
                <span>Your next challenge</span>
                <span
                    className="flex items-center gap-1.75 text-[10px] font-bold tracking-widest text-[#97a6c4] uppercase before:size-1.75 before:rounded-full before:bg-[#34a853] before:shadow-[0_0_0_4px_rgba(52,168,83,.1)] before:content-['']">
                    {spinning ? 'Spinning' : selected ? 'Category selected' : 'Ready to play'}
                </span>
            </div>
            <div
                className="flex min-h-46.5 flex-col items-start justify-center border-b border-white/10.5 py-6.5 pb-6.25 max-[900px]:min-h-40 kiosk:min-h-0 kiosk:flex-1 kiosk:py-2 portrait-tab:min-h-0 portrait-tab:flex-1 portrait-tab:py-1.75"
                data-state={state.status}>
                <div
                    className="mb-4.5 grid size-13 shrink-0 place-items-center overflow-hidden rounded-2xl border border-[#4285f4]/20 bg-[#4285f4]/13 text-[#a8c5ff] transition-all duration-300 kiosk:mb-[clamp(6px,1.35dvh,14px)] kiosk:size-[clamp(32px,5.3dvh,50px)] kiosk:rounded-xl portrait-tab:mb-1.5 portrait-tab:size-10 portrait-tab:rounded-xl short:mb-1.25"
                    style={iconStyle} aria-hidden="true">
                    <svg
                        className={`size-6.75 fill-none stroke-current stroke-[1.9] [stroke-linecap:round] [stroke-linejoin:round] kiosk:size-[65%] portrait-tab:size-5.75 ${spinning ? 'animate-[twirl_1s_linear_infinite]' : ''}`}
                        viewBox="0 0 24 24">
                        <Glyph name={selected?.icon ?? 'sparkle'}/>
                    </svg>
                </div>
                <h2 className="mb-2.25 text-[clamp(23px,2.45vw,31px)] leading-[1.15] font-[840] tracking-[-.045em] kiosk:mb-1.25 kiosk:text-[clamp(19px,2.9dvh,31px)] portrait-tab:mb-1.25 portrait-tab:text-2xl"
                    aria-live="polite" aria-atomic="true">
                    {spinning ? 'Here we go…' : selected ? selected.name + (/[!?]$/.test(selected.name) ? '' : '!') : 'Ready when you are.'}
                </h2>
                <p className="m-0 max-w-92.5 text-sm leading-[1.6] text-[#a7b4cd] kiosk:text-[clamp(11px,1.42dvh,14px)] kiosk:leading-[1.4] portrait-tab:max-w-none portrait-tab:text-xs portrait-tab:leading-[1.35]">
                    {spinning ? 'Watch where the pointer lands. Your next challenge is coming up!'
                        : selected ? selected.description
                            : 'Give the wheel a spin, then pick a printed card from the selected category.'}
                </p>
            </div>
            <p className="my-3 mt-5.5 text-[11px] font-[850] tracking-[.18em] text-[#96a5c4] uppercase kiosk:my-[clamp(7px,1.3dvh,15px)] kiosk:mb-1.75 kiosk:shrink-0 kiosk:text-[10px] portrait-tab:mt-2 portrait-tab:mb-1.75 portrait-tab:text-[10px] short:my-1 narrow-portrait:hidden">The {categories.length} categories</p>
            <div
                className="grid grid-cols-2 gap-2.25 kiosk:shrink-0 kiosk:gap-[6px_8px] portrait-tab:gap-[5px_8px] short:gap-1 narrow-portrait:hidden"
                aria-label="Possible challenge categories">
                {categories.map(cat => (
                    <div key={cat.id}
                         className={`flex min-w-0 items-center gap-2 overflow-hidden rounded-[10px] border px-2.5 py-2.25 text-[11px] font-bold whitespace-nowrap text-ellipsis text-[#d2daf0] transition-[background,border-color] duration-200 kiosk:px-2.25 kiosk:py-[clamp(5px,.85dvh,9px)] short:py-1 short:text-[9px] kiosk:text-[clamp(9px,1.16dvh,11px)] portrait-tab:px-2.25 portrait-tab:py-1.5 portrait-tab:text-[10px] ${selected?.id === cat.id ? '' : 'border-white/[.07] bg-white/[.032]'}`}
                         style={selected?.id === cat.id ? ({
                             background: `color-mix(in srgb, ${cat.color} 15%, transparent)`,
                             borderColor: `color-mix(in srgb, ${cat.color} 60%, transparent)`
                         } as CSSProperties) : undefined}>
                        <span className="size-2.25 shrink-0 rounded-[3px]" style={{
                            background: cat.color,
                            boxShadow: `0 0 10px color-mix(in srgb, ${cat.color} 40%, transparent)`
                        }} aria-hidden="true"/>
                        <span className="overflow-hidden text-ellipsis">{cat.name}</span>
                    </div>
                ))}
            </div>
            <button type="button"
                    className="mt-6 flex min-h-14.25 w-full cursor-pointer items-center justify-center gap-2.75 rounded-[14px] bg-[linear-gradient(110deg,#a8ccff,#78adff)] text-sm font-black tracking-[.075em] text-[#06172f] uppercase shadow-[0_11px_24px_rgba(66,133,244,.15)] transition-[transform,filter] duration-200 hover:-translate-y-0.5 hover:brightness-105 disabled:saturate-70 kiosk:mt-[clamp(8px,1.3dvh,16px)] kiosk:min-h-[clamp(38px,5.7dvh,52px)] kiosk:shrink-0 portrait-tab:mt-2.25 portrait-tab:min-h-10 portrait-tab:shrink-0 short:mt-2.5"
                    onClick={onSpin} disabled={spinning}>
                <svg
                    className="size-5 fill-none stroke-current stroke-[2.5] [stroke-linecap:round] [stroke-linejoin:round]"
                    viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20 11a8 8 0 1 1-2.4-5.7M20 4v7h-7"/>
                </svg>
                <span>{spinning ? 'Spinning…' : selected ? 'Spin again' : 'Spin the wheel'}</span>
            </button>
            <p className="mt-3 text-center text-[11px] text-[#8190b0] kiosk:mt-1.75 kiosk:shrink-0 kiosk:text-[10px] portrait-tab:mt-1.5 portrait-tab:shrink-0 portrait-tab:text-[10px] short:hidden narrow-portrait:hidden">Press <strong>Space</strong> to
                spin • Draw 1 card • Have fun!</p>
        </div>
    );
}
