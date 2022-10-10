import { Box, Button, HStack, VStack } from "@chakra-ui/react";
import { Dialog, Transition } from "@headlessui/react";
import clsx from "clsx";
import { FC, Fragment } from "react";
import { MdOutlineClose } from "react-icons/md";

type Props = {
  show: boolean;
  title?: React.ReactNode;
  onClose: () => void;
  children: React.ReactNode;
  panelClassName?: string;
  preventAutoClose?: boolean;
};

const Modal: FC<Props> = ({
  show,
  onClose,
  children,
  title,
  panelClassName,
  preventAutoClose = true,
}) => {
  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as="div" onClose={() => (preventAutoClose ? null : onClose())}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Box className="fixed inset-0 bg-gray-900 bg-opacity-50 dark:bg-opacity-80" />
        </Transition.Child>

        <VStack className="flex items-center justify-center h-full min-h-full  text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel
              className={clsx(
                "w-full p-5 py-5 overflow-x-hidden text-left align-middle transition-all transform shadow-xl bg-secondary rounded-2xl",
                panelClassName
              )}
            >
              {title && (
                <HStack className="flex items-center justify-between pb-2">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6"
                  >
                    {title}
                  </Dialog.Title>
                  <Button
                    type="button"
                    className="p-1 bg-gray-100 rounded-md focus:outline-none dark:bg-gray-900"
                    onClick={() => onClose()}
                  >
                    <MdOutlineClose />
                  </Button>
                </HStack>
              )}
              {children}
            </Dialog.Panel>
          </Transition.Child>
        </VStack>
      </Dialog>
    </Transition>
  );
};

export default Modal;
