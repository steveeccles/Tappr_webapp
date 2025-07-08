'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  UserIcon, 
  ChatBubbleLeftRightIcon, 
  HomeIcon, 
  Cog6ToothIcon 
} from '@heroicons/react/24/outline';
import { 
  UserIcon as UserIconSolid, 
  ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconSolid, 
  HomeIcon as HomeIconSolid, 
  Cog6ToothIcon as Cog6ToothIconSolid 
} from '@heroicons/react/24/solid';

const tabs = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: HomeIcon,
    iconActive: HomeIconSolid,
  },
  {
    name: 'Chats',
    href: '/chats',
    icon: ChatBubbleLeftRightIcon,
    iconActive: ChatBubbleLeftRightIconSolid,
  },
  {
    name: 'Profile',
    href: '/profile',
    icon: UserIcon,
    iconActive: UserIconSolid,
  },
  {
    name: 'Connections',
    href: '/connections',
    icon: ChatBubbleLeftRightIcon,
    iconActive: ChatBubbleLeftRightIconSolid,
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Cog6ToothIcon,
    iconActive: Cog6ToothIconSolid,
  },
];

export default function TabNavigation() {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Bottom Tabs */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="grid grid-cols-5 h-16">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href || pathname.startsWith(tab.href + '/');
            const Icon = isActive ? tab.iconActive : tab.icon;
            
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={`flex flex-col items-center justify-center space-y-1 ${
                  isActive 
                    ? 'text-indigo-600' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Icon className="h-6 w-6" />
                <span className="text-xs font-medium">{tab.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Desktop Top Tabs */}
      <div className="hidden lg:block bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const isActive = pathname === tab.href || pathname.startsWith(tab.href + '/');
              const Icon = isActive ? tab.iconActive : tab.icon;
              
              return (
                <Link
                  key={tab.name}
                  href={tab.href}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm ${
                    isActive
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
} 