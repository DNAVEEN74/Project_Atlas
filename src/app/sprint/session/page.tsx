'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DeprecatedSessionPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/sprint');
    }, [router]);

    return null;
}
