"use client";

import { useState } from "react";

import {
  FormProvider,
  useForm,
  useWatch,
} from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import AddLinkDialog, {
  type AddedLink,
} from "../../AddLinkDialog";

import EntryMessageFooter from "./EntryMessageFooter";
import MessageEditor, {
  type MessageVariable,
} from "./MessageEditor";
import MessagePreview from "./MessagePreview";

import {
  entryMessageSaved,
  nextStep,
  previousStep,
  selectEntryMessage,
} from "@/lib/features/campaign-builder/campaignBuilderSlice";

import {
  entryMessageSchema,
  type EntryMessageFormValues,
} from "@/lib/features/campaign-builder/entryMessageSchema";

import {
  useAppDispatch,
  useAppSelector,
} from "@/lib/hooks";


const DEFAULT_LINK_URL =
  "https://www.atrmajlesi.ir";

const previewCustomer = {
  firstName: "سعید",
  lastName: "طباطبایی",
  clubName: "عطر مجلسی",
  points: "۱۲۰",
  credit: "۵۰۰٬۰۰۰ تومان",
  userLevel: "طلایی",
} as const;

const messageVariables: readonly MessageVariable[] = [
  {
    id: "credit",
    label: "اعتبار",
    token: "{{credit}}",
  },
  {
    id: "userLevel",
    label: "سطح کاربری",
    token: "{{userLevel}}",
  },
  {
    id: "clubName",
    label: "نام مجموعه",
    token: "{{clubName}}",
  },
  {
    id: "firstName",
    label: "نام",
    token: "{{firstName}}",
  },
  {
    id: "lastName",
    label: "نام خانوادگی",
    token: "{{lastName}}",
  },
  {
    id: "points",
    label: "امتیاز",
    token: "{{points}}",
  },
];


function createDefaultMessage(): string {
  return `سلام ${previewCustomer.firstName} عزیز
ورود شما را به باشگاه مشتریان ${previewCustomer.clubName} تبریک می‌گوییم
امتیاز شما در باشگاه ما: ${previewCustomer.points}
${DEFAULT_LINK_URL}
لغو11`;
}


function createPreviewMessage(
  message: string,
  linkUrl: string,
): string {
  const values: Record<string, string> = {
    firstName: previewCustomer.firstName,
    lastName: previewCustomer.lastName,
    clubName: previewCustomer.clubName,
    points: previewCustomer.points,
    credit: previewCustomer.credit,
    userLevel: previewCustomer.userLevel,
    link: linkUrl || DEFAULT_LINK_URL,
  };

  const source =
    message.trim() ||
    createDefaultMessage();

  return source.replace(
    /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g,
    (
      originalToken: string,
      variableName: string,
    ) =>
      values[variableName] ??
      originalToken,
  );
}


export default function EntryMessageStep() {
  const dispatch = useAppDispatch();

  const savedEntryMessage =
    useAppSelector(
      selectEntryMessage,
    );

  const [
    isPreviewOpen,
    setIsPreviewOpen,
  ] = useState(true);

  const [
    isLinkDialogOpen,
    setIsLinkDialogOpen,
  ] = useState(false);


  const methods =
    useForm<EntryMessageFormValues>({
      resolver: zodResolver(
        entryMessageSchema,
      ),

      mode: "onSubmit",

      defaultValues: {
        isEnabled:
          savedEntryMessage.isEnabled ??
          true,

        senderLineId:
          savedEntryMessage.senderLineId ||
          "1000000000",

        message:
          savedEntryMessage.message ||
          createDefaultMessage(),

        linkUrl:
          savedEntryMessage.linkUrl ||
          DEFAULT_LINK_URL,

        uniqueLinkPerCustomer:
          savedEntryMessage
            .uniqueLinkPerCustomer ??
          false,
      },
    });


  const {
    control,
    getValues,
    setValue,
    trigger,
  } = methods;


  const isEnabled =
    useWatch({
      control,
      name: "isEnabled",
    }) ?? false;

  const message =
    useWatch({
      control,
      name: "message",
    }) ?? "";

  const linkUrl =
    useWatch({
      control,
      name: "linkUrl",
    }) ?? DEFAULT_LINK_URL;

  const uniqueLinkPerCustomer =
    useWatch({
      control,
      name: "uniqueLinkPerCustomer",
    }) ?? false;


  const previewMessage =
    createPreviewMessage(
      message,
      linkUrl,
    );


  async function handleNext() {
    const isValid =
      await trigger();

    if (!isValid) {
      return;
    }

    dispatch(
      entryMessageSaved(
        getValues(),
      ),
    );

    dispatch(nextStep());
  }


  function handleSaveDraft() {
    dispatch(
      entryMessageSaved(
        getValues(),
      ),
    );
  }


  function handlePrevious() {
    dispatch(previousStep());
  }


  function insertTokenIntoMessage(
    value: string,
    start: number,
    end: number,
  ) {
    const currentMessage =
      getValues("message") ?? "";

    const newMessage =
      currentMessage.slice(0, start) +
      value +
      currentMessage.slice(end);

    setValue(
      "message",
      newMessage,
      {
        shouldDirty: true,
      },
    );
  }


  function handleAiRewrite() {
    const currentLink =
      getValues("linkUrl") ||
      DEFAULT_LINK_URL;

    const rewrittenMessage =
      `سلام ${previewCustomer.firstName} عزیز
ورود شما را به باشگاه مشتریان ${previewCustomer.clubName} تبریک می‌گوییم
امتیاز شما در باشگاه ما: ${previewCustomer.points}
${currentLink}
لغو11`;

    setValue(
      "message",
      rewrittenMessage,
      {
        shouldDirty: true,
      },
    );
  }


  function handleAddLink(
    addedLink: AddedLink,
  ) {
    const newUrl =
      addedLink.url.trim();

    const oldUrl =
      getValues(
        "linkUrl",
      )?.trim() ?? "";

    let nextMessage =
      getValues("message") ?? "";

    if (
      nextMessage.includes(
        "{{link}}",
      )
    ) {
      nextMessage =
        nextMessage.replaceAll(
          "{{link}}",
          newUrl,
        );
    } else if (
      oldUrl &&
      nextMessage.includes(oldUrl)
    ) {
      nextMessage =
        nextMessage.replaceAll(
          oldUrl,
          newUrl,
        );
    } else {
      const separator =
        nextMessage.length > 0 &&
        !nextMessage.endsWith("\n")
          ? "\n"
          : "";

      nextMessage =
        `${nextMessage}${separator}${newUrl}`;
    }

    setValue(
      "linkUrl",
      newUrl,
      {
        shouldDirty: true,
      },
    );

    setValue(
      "uniqueLinkPerCustomer",
      addedLink.uniquePerCustomer,
      {
        shouldDirty: true,
      },
    );

    setValue(
      "message",
      nextMessage,
      {
        shouldDirty: true,
      },
    );

    setIsLinkDialogOpen(false);
  }


  return (
    <FormProvider {...methods}>
      <form
        noValidate
        className="relative h-315.75 w-full bg-surface"
      >
        <main className="h-296.5 w-full px-6 pt-16 lg:px-25">
          <div className="mx-auto flex h-280.5 w-full max-w-199.75 flex-col gap-8">
            <MessageEditor
              isEnabled={isEnabled}
              message={message}
              variables={
                messageVariables
              }
              onInsertToken={
                insertTokenIntoMessage
              }
              onOpenLinkDialog={() =>
                setIsLinkDialogOpen(
                  true,
                )
              }
              onAiRewrite={
                handleAiRewrite
              }
            />

            <MessagePreview
              isOpen={
                isPreviewOpen
              }
              isEnabled={
                isEnabled
              }
              message={
                previewMessage
              }
              onToggle={() =>
                setIsPreviewOpen(
                  (current) =>
                    !current,
                )
              }
            />
          </div>
        </main>

        <EntryMessageFooter
          onPrevious={
            handlePrevious
          }
          onSaveDraft={
            handleSaveDraft
          }
          onNext={
            handleNext
          }
        />
      </form>

      <AddLinkDialog
        open={
          isLinkDialogOpen
        }
        initialUrl={
          linkUrl ||
          DEFAULT_LINK_URL
        }
        initialUniquePerCustomer={
          uniqueLinkPerCustomer
        }
        onOpenChange={
          setIsLinkDialogOpen
        }
        onAddLink={
          handleAddLink
        }
      />
    </FormProvider>
  );
}