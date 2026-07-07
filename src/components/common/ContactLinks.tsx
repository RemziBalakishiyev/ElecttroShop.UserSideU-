import type { ComponentType, SVGProps } from 'react';
import { Instagram, Phone } from 'lucide-react';
import { cn } from './Button';
import { WHATSAPP_NUMBER } from '../../config/contact';

type IconType = ComponentType<SVGProps<SVGSVGElement>>;

/** TikTok brendi lucide-react-də yoxdur — inline SVG. */
function TikTokIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
            <path d="M16.5 3c.3 2.2 1.6 3.9 3.8 4.2v2.6c-1.3.1-2.6-.3-3.8-1v6.6c0 3.6-2.7 5.9-5.9 5.9-2.9 0-5.3-2.1-5.3-5 0-3 2.4-5.1 5.4-4.9v2.7c-.4-.1-.9-.2-1.3-.1-1.2.1-2.2 1-2.1 2.4.1 1.3 1.1 2.2 2.4 2.1 1.4-.1 2.1-1.1 2.1-2.6V3h2.7z" />
        </svg>
    );
}

/** WhatsApp brendi lucide-react-də yoxdur — inline SVG. */
function WhatsAppIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
            <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2zm0 1.8a8.2 8.2 0 0 1 6.9 12.7 8.2 8.2 0 0 1-10.8 2.6l-.3-.2-2.9.8.8-2.8-.2-.3A8.2 8.2 0 0 1 12 3.8zm-3 3.6c-.2 0-.4 0-.6.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.4c.2.2 1.6 2.6 4 3.5 2 .8 2.4.6 2.8.6.4 0 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1-.1-.1-.2-.2-.5-.3l-1.4-.7c-.2-.1-.4-.1-.5.1l-.6.8c-.1.1-.2.2-.5.1s-1.1-.4-2.1-1.3c-.8-.7-1.3-1.5-1.4-1.8-.1-.2 0-.4.1-.5l.4-.4c.1-.1.2-.3.2-.4v-.4l-.7-1.7c-.2-.5-.4-.4-.5-.4h-.3z" />
        </svg>
    );
}

interface ContactChannel {
    label: string;
    href: string;
    icon: IconType;
    external: boolean;
}

const contactChannels: ContactChannel[] = [
    {
        label: 'Instagram',
        href: 'https://www.instagram.com/smartal.az?igsh=MWRvNXJ5Z200bGVkcg%3D%3D&utm_source=qr',
        icon: Instagram,
        external: true,
    },
    {
        label: 'TikTok',
        href: 'https://www.tiktok.com/@smartal.az?_r=1&_t=ZS-97duItpzsgf',
        icon: TikTokIcon,
        external: true,
    },
    {
        label: 'WhatsApp',
        href: `https://wa.me/${WHATSAPP_NUMBER}`,
        icon: WhatsAppIcon,
        external: true,
    },
    {
        label: '+994 50 514 72 00',
        href: 'tel:+994505147200',
        icon: Phone,
        external: false,
    },
];

interface ContactLinksProps {
    /** `light` — ağ fon (səhifə), `dark` — qara fon (footer). */
    variant?: 'light' | 'dark';
    className?: string;
}

export default function ContactLinks({ variant = 'light', className }: ContactLinksProps) {
    const linkClasses =
        variant === 'dark'
            ? 'text-gray-300 hover:text-white hover:bg-white/10'
            : 'text-gray-700 hover:text-black hover:bg-gray-100';

    return (
        <ul className={cn('flex flex-col gap-1', className)}>
            {contactChannels.map(({ label, href, icon: Icon, external }) => (
                <li key={label}>
                    <a
                        href={href}
                        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                        className={cn(
                            'inline-flex items-center gap-3 rounded-md px-2 py-2 text-sm font-medium transition-colors',
                            linkClasses
                        )}
                    >
                        <Icon className="h-5 w-5 shrink-0" />
                        <span>{label}</span>
                    </a>
                </li>
            ))}
        </ul>
    );
}
