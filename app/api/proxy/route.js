import { NextResponse } from 'next/server';

export async function POST(request) {
    const formData = await request.json();

    try {
        const response = await fetch('https://evf-regionsormland.preciocloudapp.net/api/Claims', {
            method: 'POST',
            headers: {
                'accept': 'application/json;charset=UTF-8',
                'content-type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            return NextResponse.json({ error: 'Failed to submit claim' }, { status: response.status });
        }

        const data = await response.json();
        console.log(response.status);
        console.log(data);

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'An error occurred while connecting to the server' }, { status: 500 });
    }
}