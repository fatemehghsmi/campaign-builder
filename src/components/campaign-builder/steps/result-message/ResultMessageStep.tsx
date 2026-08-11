"use client";

import {
  useRef,
  useState,
  type ChangeEvent,
} from "react";

import {
  useForm,
  useWatch,
} from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import AddLinkDialog, {
  type AddedLink,
} from "../../AddLinkDialog";

import ResultMessageEditor, {
  type ResultMessageVariable,
} from "./ResultMessageEditor";

import ResultMessageFooter from "./ResultMessageFooter";
import ResultMessagePreview from "./ResultMessagePreview";

import {
  nextStep,
  previousStep,
  resultMessageSaved,
  selectResultMessage,
} from "@/lib/features/campaign-builder/campaignBuilderSlice";

import {
  resultMessageSchema,
  type ResultMessageFormValues,
} from "@/lib/features/campaign-builder/resultMessageSchema";

import {
  useAppDispatch,
  useAppSelector,
} from "@/lib/hooks";


const DEFAULT_LINK = "https://www.atrmajlesi.ir";

const exampleCustomer = {
  firstName: "سعید",
  lastName: "احمدی",
  clubName: "عطر مجلسی",
  userLevel: "طلایی",
  points: "۱٬۲۰۰",
  credit: "۵۰۰٬۰۰۰ تومان",
} as const;

const messageVariables: readonly ResultMessageVariable[] = [
  { id: "credit", label: "اعتبار", value: exampleCustomer.credit },
  { id: "userLevel", label: "سطح کاربری", value: exampleCustomer.userLevel },
  { id: "clubName", label: "نام مجموعه", value: exampleCustomer.clubName },
  { id: "firstName", label: "نام", value: exampleCustomer.firstName },
  { id: "lastName", label: "نام خانوادگی", value: exampleCustomer.lastName },
  { id: "points", label: "امتیاز", value: exampleCustomer.points },
];


function createDefaultMessage(linkUrl: string): string {
  return `سلام ${exampleCustomer.firstName} ${exampleCustomer.lastName} عزیز
ورود شما را به باشگاه مشتریان ${exampleCustomer.clubName} تبریک می‌گوییم.
سطح کاربری شما ${exampleCustomer.userLevel} است.
امتیاز شما در باشگاه ما: ${exampleCustomer.points}
اعتبار شما: ${exampleCustomer.credit}
${linkUrl}
لغو 11`;
}


export default function ResultMessageStep() {
  const dispatch = useAppDispatch();
  const savedResultMessage = useAppSelector(selectResultMessage);

  const imageInputRef = useRef<HTMLInputElement>(null);

  const [isPreviewOpen, setIsPreviewOpen] = useState(true);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [imageError, setImageError] = useState("");

  const initialLinkUrl =
    savedResultMessage.linkUrl || DEFAULT_LINK;

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<ResultMessageFormValues>({
    resolver: zodResolver(resultMessageSchema),
    mode: "onSubmit",

    defaultValues: {
      isEnabled: savedResultMessage.isEnabled ?? true,
      channel: "bale",
      imageUrl: savedResultMessage.imageUrl ?? "",

      message:
        savedResultMessage.message?.trim() ||
        createDefaultMessage(initialLinkUrl),

      linkUrl: initialLinkUrl,

      uniqueLinkPerCustomer:
        savedResultMessage.uniqueLinkPerCustomer ?? false,
    },
  });

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

  const imageUrl =
    useWatch({
      control,
      name: "imageUrl",
    }) ?? "";

  const linkUrl =
    useWatch({
      control,
      name: "linkUrl",
    }) ?? DEFAULT_LINK;

  const uniqueLinkPerCustomer =
    useWatch({
      control,
      name: "uniqueLinkPerCustomer",
    }) ?? false;

  const previewMessage =
    message.trim() ||
    "متن پیام شما در این قسمت نمایش داده می‌شود.";


  function handleValidSubmit(
    values: ResultMessageFormValues,
  ) {
    dispatch(resultMessageSaved(values));
    dispatch(nextStep());
  }


  function handleSaveDraft() {
    dispatch(
      resultMessageSaved(
        getValues(),
      ),
    );
  }


  function handlePrevious() {
    dispatch(previousStep());
  }


function insertTextIntoMessage(
  value: string,
  start: number,
  end: number,
) {
  const message =
    getValues("message") ?? "";

  setValue(
    "message",
    message.slice(0, start) +
      value +
      message.slice(end),
    {
      shouldDirty: true,
    },
  );
}

  function handleAiRewrite() {
    const currentLink =
      getValues("linkUrl") ||
      DEFAULT_LINK;

    setValue(
      "message",
      createDefaultMessage(currentLink),
      {
        shouldDirty: true,
      },
    );
  }


  function handleImageButtonClick() {
    imageInputRef.current?.click();
  }


  function handleImageChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setImageError(
        "فقط فایل JPG، PNG یا WEBP قابل قبول است",
      );

      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setImageError(
        "حجم تصویر نباید بیشتر از ۵ مگابایت باشد",
      );

      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== "string") {
        return;
      }

      setValue(
        "imageUrl",
        reader.result,
        {
          shouldDirty: true,
        },
      );

      setImageError("");
    };

    reader.onerror = () => {
      setImageError(
        "خواندن تصویر با خطا مواجه شد",
      );
    };

    reader.readAsDataURL(file);

    event.target.value = "";
  }


  function handleDeleteImage() {
    setValue(
      "imageUrl",
      "",
      {
        shouldDirty: true,
      },
    );

    setImageError("");
  }


  function handleAddLink(
    addedLink: AddedLink,
  ) {
    const newUrl =
      addedLink.url.trim();

    const oldUrl =
      getValues("linkUrl")?.trim() ??
      "";

    let currentMessage =
      getValues("message") ?? "";

    if (currentMessage.includes("{{link}}")) {
      currentMessage =
        currentMessage.replaceAll(
          "{{link}}",
          newUrl,
        );
    } else if (
      oldUrl &&
      currentMessage.includes(oldUrl)
    ) {
      currentMessage =
        currentMessage.replaceAll(
          oldUrl,
          newUrl,
        );
    } else if (
      !currentMessage.includes(newUrl)
    ) {
      currentMessage +=
        (currentMessage.length > 0 &&
        !currentMessage.endsWith("\n")
          ? "\n"
          : "") + newUrl;
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
      currentMessage,
      {
        shouldDirty: true,
      },
    );

    setIsLinkDialogOpen(false);
  }


  return (
    <>
      <form
        onSubmit={handleSubmit(handleValidSubmit)}
        noValidate
        className="relative min-h-365 w-full bg-surface"
      >
        <input
          ref={imageInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleImageChange}
          className="hidden"
        />

        <main className="w-full px-6 pb-10 pt-16 lg:px-25">
          <div className="mx-auto flex w-full max-w-199.75 flex-col gap-8">
            <ResultMessageEditor
              control={control}
              errors={errors}
              clearErrors={clearErrors}
              isEnabled={isEnabled}
              message={message}
              imageUrl={imageUrl}
              imageError={imageError}
              variables={messageVariables}
              onInsertValue={insertTextIntoMessage}
              onOpenLinkDialog={() =>
                setIsLinkDialogOpen(true)
              }
              onAiRewrite={handleAiRewrite}
              onImageButtonClick={handleImageButtonClick}
              onDeleteImage={handleDeleteImage}
            />

            <ResultMessagePreview
              isOpen={isPreviewOpen}
              isEnabled={isEnabled}
              message={previewMessage}
              imageUrl={imageUrl}
              onToggle={() =>
                setIsPreviewOpen(
                  (current) => !current,
                )
              }
            />
          </div>
        </main>

        <ResultMessageFooter
          onPrevious={handlePrevious}
          onSaveDraft={handleSaveDraft}
        />
      </form>

      <AddLinkDialog
        open={isLinkDialogOpen}
        initialUrl={linkUrl || DEFAULT_LINK}
        initialUniquePerCustomer={
          uniqueLinkPerCustomer
        }
        onOpenChange={setIsLinkDialogOpen}
        onAddLink={handleAddLink}
      />
    </>
  );
}