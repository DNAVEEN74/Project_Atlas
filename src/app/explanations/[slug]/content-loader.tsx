import React from 'react';
import { notFound } from 'next/navigation';

// ============================================
// QUANT IMPORTS (24 Patterns)
// ============================================
import PercentageContent from '@/app/explanations/content/quant/percentage';
import ProfitLossContent from '@/app/explanations/content/quant/profit-loss';
import SimpleInterestContent from '@/app/explanations/content/quant/simple-interest';
import CompoundInterestContent from '@/app/explanations/content/quant/compound-interest';
import TimeWorkContent from '@/app/explanations/content/quant/time-work';
import RatioProportionContent from '@/app/explanations/content/quant/ratio-proportion';
import NumberSystemContent from '@/app/explanations/content/quant/number-system';
import TimeSpeedDistanceContent from '@/app/explanations/content/quant/time-speed-distance';
import AlgebraContent from '@/app/explanations/content/quant/algebra';
import TrigonometryContent from '@/app/explanations/content/quant/trigonometry';
import GeometryContent from '@/app/explanations/content/quant/geometry';
import SimplificationContent from '@/app/explanations/content/quant/simplification';
import AverageContent from '@/app/explanations/content/quant/average';
import HCFLCMContent from '@/app/explanations/content/quant/hcf-lcm';
import PartnershipContent from '@/app/explanations/content/quant/partnership';
import MixturesAlligationContent from '@/app/explanations/content/quant/mixtures-alligation';
import PipeCisternContent from '@/app/explanations/content/quant/pipe-cistern';
import BoatStreamContent from '@/app/explanations/content/quant/boat-stream';
import HeightDistanceContent from '@/app/explanations/content/quant/height-distance';
import Mensuration2DContent from '@/app/explanations/content/quant/mensuration-2d';
import Mensuration3DContent from '@/app/explanations/content/quant/mensuration-3d';
import CoordinateGeometryContent from '@/app/explanations/content/quant/coordinate-geometry';
import PowerIndicesSurdsContent from '@/app/explanations/content/quant/power-indices-surds';
import DataInterpretationContent from '@/app/explanations/content/quant/data-interpretation';

// ============================================
// REASONING IMPORTS (17 Patterns)
// ============================================
import CodingDecodingContent from '@/app/explanations/content/reasoning/coding-decoding';
import BloodRelationsContent from '@/app/explanations/content/reasoning/blood-relations';
import DirectionSenseContent from '@/app/explanations/content/reasoning/direction-sense';
import SyllogismContent from '@/app/explanations/content/reasoning/syllogism';
import SeriesContent from '@/app/explanations/content/reasoning/series';
import AnalogyContent from '@/app/explanations/content/reasoning/analogy';
import ClassificationContent from '@/app/explanations/content/reasoning/classification';
import MissingNumberContent from '@/app/explanations/content/reasoning/missing-number';
import CountingFiguresContent from '@/app/explanations/content/reasoning/counting-figures';
import MirrorWaterImageContent from '@/app/explanations/content/reasoning/mirror-water-image';
import PaperCuttingContent from '@/app/explanations/content/reasoning/paper-cutting';
import EmbeddedFiguresContent from '@/app/explanations/content/reasoning/embedded-figures';
import DiceCubeContent from '@/app/explanations/content/reasoning/dice-cube';
import VennDiagramContent from '@/app/explanations/content/reasoning/venn-diagram';
import StatementConclusionContent from '@/app/explanations/content/reasoning/statement-conclusion';
import OrderRankingContent from '@/app/explanations/content/reasoning/order-ranking';
import SittingArrangementContent from '@/app/explanations/content/reasoning/sitting-arrangement';
import ClockCalendarContent from '@/app/explanations/content/reasoning/clock-calendar';

interface ContentLoaderProps {
    slug: string;
}

export function PatternContent({ slug }: ContentLoaderProps) {
    switch (slug) {
        // ============================================
        // QUANT (24 Patterns)
        // ============================================
        case 'percentage':
            return <PercentageContent />;
        case 'profit-loss':
            return <ProfitLossContent />;
        case 'simple-interest':
            return <SimpleInterestContent />;
        case 'compound-interest':
            return <CompoundInterestContent />;
        case 'time-work':
            return <TimeWorkContent />;
        case 'ratio-proportion':
            return <RatioProportionContent />;
        case 'number-system':
            return <NumberSystemContent />;
        case 'time-speed-distance':
            return <TimeSpeedDistanceContent />;
        case 'algebra':
            return <AlgebraContent />;
        case 'trigonometry':
            return <TrigonometryContent />;
        case 'geometry':
            return <GeometryContent />;
        case 'simplification':
            return <SimplificationContent />;
        case 'average':
            return <AverageContent />;
        case 'hcf-lcm':
            return <HCFLCMContent />;
        case 'partnership':
            return <PartnershipContent />;
        case 'mixtures-alligation':
            return <MixturesAlligationContent />;
        case 'pipe-cistern':
            return <PipeCisternContent />;
        case 'boat-stream':
            return <BoatStreamContent />;
        case 'height-distance':
            return <HeightDistanceContent />;
        case 'mensuration-2d':
            return <Mensuration2DContent />;
        case 'mensuration-3d':
            return <Mensuration3DContent />;
        case 'coordinate-geometry':
            return <CoordinateGeometryContent />;
        case 'power-indices-surds':
            return <PowerIndicesSurdsContent />;
        case 'data-interpretation':
            return <DataInterpretationContent />;

        // ============================================
        // REASONING (17 Patterns)
        // ============================================
        case 'coding-decoding':
            return <CodingDecodingContent />;
        case 'blood-relations':
            return <BloodRelationsContent />;
        case 'direction-sense':
            return <DirectionSenseContent />;
        case 'syllogism':
            return <SyllogismContent />;
        case 'series':
            return <SeriesContent />;
        case 'analogy':
            return <AnalogyContent />;
        case 'classification':
            return <ClassificationContent />;
        case 'missing-number':
            return <MissingNumberContent />;
        case 'counting-figures':
            return <CountingFiguresContent />;
        case 'mirror-water-image':
            return <MirrorWaterImageContent />;
        case 'paper-cutting':
            return <PaperCuttingContent />;
        case 'embedded-figures':
            return <EmbeddedFiguresContent />;
        case 'dice-cube':
            return <DiceCubeContent />;
        case 'venn-diagram':
            return <VennDiagramContent />;
        case 'statement-conclusion':
            return <StatementConclusionContent />;
        case 'order-ranking':
            return <OrderRankingContent />;
        case 'sitting-arrangement':
            return <SittingArrangementContent />;
        case 'clock-calendar':
            return <ClockCalendarContent />;

        // ============================================
        // DEFAULT FALLBACK
        // ============================================
        default:
            return (
                <div className="py-10 text-center border border-dashed border-neutral-700 rounded-xl bg-neutral-800/30">
                    <p className="text-neutral-400 italic">
                        Detailed explanation for <span className="text-white font-medium">{slug}</span> is coming soon.
                    </p>
                    <p className="text-sm text-neutral-500 mt-2">
                        We are working on creating world-class content for this topic.
                    </p>
                </div>
            );
    }
}
