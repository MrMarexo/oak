"use client";

import {
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  Drawer,
} from "@/components/ui/drawer";
import { ReactNode, useState } from "react";

export const DrawerComponent = ({
  toggleChild,
  title,
  // onSelectJokerAlternative,
  // jokerColor,
  children,
  toggleOnClick,
}: {
  toggleChild: ReactNode;
  title: string;
  // onSelectJokerAlternative: (alternative: CurrencyCard) => void;
  // jokerColor: CurrencyCard["color"];
  children: ReactNode;
  toggleOnClick?: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleTrigger = () => {
    toggleOnClick && toggleOnClick();
    setIsOpen(!isOpen);
  };
  return (
    <Drawer>
      <DrawerTrigger onClick={handleTrigger}>{toggleChild}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          {/* <DrawerDescription>This action cannot be undone.</DrawerDescription> */}
        </DrawerHeader>
        <div className="mx-2">
          {children}
          {/* <JokerCardsSelect
            onCardSelect={(alternative) => {
              onSelectJokerAlternative(alternative);
            }}
            color={jokerColor}
          /> */}
        </div>

        <DrawerFooter>
          {/* <Button>Submit</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose> */}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
