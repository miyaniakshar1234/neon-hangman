export interface ShopItem {
    id: string;
    name: string;
    description: string;
    price: number;
    currency?: 'score' | 'coins';
    type: 'sound_pack' | 'avatar_border' | 'consumable';
    value: string; // E.g., 'mechanical' for sound pack, CSS class for avatar, 'hint' for consumables
}

export const SHOP_ITEMS: ShopItem[] = [
    {
        id: 'snd_cyberpunk',
        name: 'Cyberpunk Synth Pack',
        description: 'Replaces standard keystrokes with heavy, digitized cyberpunk synth hits.',
        price: 5000,
        type: 'sound_pack',
        value: 'cyberpunk'
    },
    {
        id: 'snd_mechanical',
        name: 'Mechanical Keyboard',
        description: 'Crisp, tactile mechanical switch sounds for every letter you type.',
        price: 3500,
        type: 'sound_pack',
        value: 'mechanical'
    },
    {
        id: 'border_toxic',
        name: 'Toxic Radiation',
        description: 'A glowing, animated radioactive green border for your profile avatar.',
        price: 8000,
        type: 'avatar_border',
        value: 'border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.8)]'
    },
    {
        id: 'border_plasma',
        name: 'Plasma Core',
        description: 'A deep, pulsating violet and blue plasma border.',
        price: 15000,
        type: 'avatar_border',
        value: 'border-fuchsia-500 shadow-[0_0_25px_rgba(217,70,239,0.8)]'
    },
    {
        id: 'consumable_hint_x3',
        name: 'Global Hint Pack (x3)',
        description: 'Instantly decodes 3 random letters anytime during any mission.',
        price: 20,

        currency: 'coins',
        type: 'consumable',
        value: '3'
    }
];
