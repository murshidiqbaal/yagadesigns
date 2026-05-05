import { useCallback, useRef, useState } from 'react';

interface UseLongPressOptions {
  onLongPress: (event: React.MouseEvent | React.TouchEvent) => void;
  onClick?: (event: React.MouseEvent | React.TouchEvent) => void;
  delay?: number;
}

export default function useLongPress({
  onLongPress,
  onClick,
  delay = 5000,
}: UseLongPressOptions) {
  const [isPressing, setIsPressing] = useState(false);
  const [longPressTriggered, setLongPressTriggered] = useState(false);
  const timeout = useRef<NodeJS.Timeout | null>(null);
  const isTriggeredRef = useRef(false);

  const start = useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {
      // event.persist(); // Not needed in modern React
      setIsPressing(true);
      setLongPressTriggered(false);
      isTriggeredRef.current = false;
      
      timeout.current = setTimeout(() => {
        onLongPress(event);
        setLongPressTriggered(true);
        isTriggeredRef.current = true;
        setIsPressing(false);
      }, delay);
    },
    [onLongPress, delay]
  );

  const clear = useCallback(
    (event: React.MouseEvent | React.TouchEvent, shouldTriggerClick = true) => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
      
      if (shouldTriggerClick && !isTriggeredRef.current && onClick) {
        onClick(event);
      }

      setIsPressing(false);
      // We don't reset longPressTriggered here immediately if we need it for the click event
    },
    [onClick]
  );

  const handleOnClick = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (isTriggeredRef.current) {
      e.preventDefault();
      e.stopPropagation();
      // Reset after the click event has been handled
      setLongPressTriggered(false);
      isTriggeredRef.current = false;
    }
  }, []);

  return {
    isPressing,
    longPressTriggered,
    onMouseDown: (e: React.MouseEvent) => start(e),
    onTouchStart: (e: React.TouchEvent) => start(e),
    onMouseUp: (e: React.MouseEvent) => clear(e),
    onMouseLeave: (e: React.MouseEvent) => clear(e, false),
    onTouchEnd: (e: React.TouchEvent) => clear(e),
    onClick: handleOnClick,
  };
}
