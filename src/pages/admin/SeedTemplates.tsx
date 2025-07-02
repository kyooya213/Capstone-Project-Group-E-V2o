import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';

export const SeedTemplates: React.FC = () => {
  const [status, setStatus] = useState('');

  const seedTemplates = async () => {
    setStatus('Seeding...');
    const templates = [
      {
        id: 'tpl-001',
        name: 'Grand Opening Banner',
        description: 'A bold and colorful tarpaulin for business grand openings. Includes space for logos and promotions.',
        category: 'Business',
        preview_url: 'https://i.imgur.com/0XCEGzt.jpg',
        price_modifier: 50,
        rating_average: 4.7,
        usage_count: 120,
        is_active: true,
        created_at: new Date('2024-12-10T10:00:00Z').toISOString(),
      },
      {
        id: 'tpl-002',
        name: 'Birthday Celebration',
        description: "A fun and vibrant design perfect for kids' birthday parties. Includes photo area and custom message.",
        category: 'Events',
        preview_url: 'https://i.imgur.com/gxw7Y9W.jpg',
        price_modifier: 30,
        rating_average: 4.8,
        usage_count: 95,
        is_active: true,
        created_at: new Date('2025-01-15T12:00:00Z').toISOString(),
      },
      {
        id: 'tpl-003',
        name: 'Real Estate for Sale',
        description: 'Clean and professional tarpaulin for promoting houses, apartments, or lots for sale.',
        category: 'Real Estate',
        preview_url: 'https://i.imgur.com/qkmNSmX.jpg',
        price_modifier: 40,
        rating_average: 4.5,
        usage_count: 88,
        is_active: true,
        created_at: new Date('2025-02-01T08:30:00Z').toISOString(),
      },
      {
        id: 'tpl-004',
        name: 'Big Sale Promo',
        description: 'Eye-catching template for retail stores promoting big discounts and flash sales.',
        category: 'Promotions',
        preview_url: 'https://i.imgur.com/NZ4ZEmm.jpg',
        price_modifier: 35,
        rating_average: 4.6,
        usage_count: 103,
        is_active: true,
        created_at: new Date('2025-03-10T11:15:00Z').toISOString(),
      },
      {
        id: 'tpl-005',
        name: 'Wedding Welcome Board',
        description: 'Elegant and romantic template for welcoming guests at a wedding ceremony.',
        category: 'Events',
        preview_url: 'https://i.imgur.com/h7JeuFa.jpg',
        price_modifier: 60,
        rating_average: 4.9,
        usage_count: 78,
        is_active: true,
        created_at: new Date('2025-04-20T09:45:00Z').toISOString(),
      },
    ];

    const { error } = await supabase.from('templates').insert(templates);

    if (error) {
      console.error('Seeding failed:', error);
      setStatus('Failed to seed templates. See console for error.');
    } else {
      setStatus('Templates successfully seeded!');
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Seed Template Data</h1>
      <Button onClick={seedTemplates}>Seed Templates</Button>
      <p className="text-sm text-gray-600">{status}</p>
    </div>
  );
};