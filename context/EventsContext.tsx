// UserContext.tsx
import React, {createContext} from 'react';
import { Invitation } from '@/interfaces';

interface EventContextProps {
    events: Invitation[] | null;
    setEvents: React.Dispatch<React.SetStateAction<Invitation[] | null>>;

}

// Initialize with default value
export const EventsContext = createContext<EventContextProps>({
    events: null,
    setEvents: () => {
    },
});



