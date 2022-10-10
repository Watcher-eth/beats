import { useQuery } from "@apollo/client";
import { Box, Button, VStack, Text } from "@chakra-ui/react";
import { Input } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import usePersistStore from "../../../../lib/store/persist";
import { WMATIC_TOKEN_ADDRESS } from "../../../../lib/constants";
import { MODULES_CURRENCY_QUERY } from "graphql/LEnstube";
import clsx from "clsx";
import React, { Dispatch, FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Erc20 } from "../../../../types";
import { CollectModuleType, UploadedPost } from "../../../../types/local";
import { z } from "zod";
import { useProfile } from "../../../../context/context";
import { ProfileFields } from "graphql/fragments";
type Props = {
  uploadedVideo: UploadedPost;
  // eslint-disable-next-line no-unused-vars
  setCollectType: (data: CollectModuleType) => void;
  onClose: any;
};

const formSchema = z.object({
  currency: z.string(),
  amount: z.string().min(1, { message: "Invalid amount" }),
  collectLimit: z.string().min(1, { message: "Invalid collect limit" }),
  referralPercent: z
    .number()
    .max(100, { message: "Percentage should be 0 to 100" })
    .nonnegative({ message: "Should to greater than or equal to zero" }),
});
export type FormData = z.infer<typeof formSchema>;

const FeeCollectForm: FC<Props> = ({ uploadedVideo, setCollectType }) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    unregister,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      referralPercent: Number(uploadedVideo.collectModule.referralFee || 0),
      currency:
        uploadedVideo.collectModule.amount?.currency ?? WMATIC_TOKEN_ADDRESS,
      amount: uploadedVideo.collectModule.amount?.value,
      collectLimit: uploadedVideo.collectModule.collectLimit || "1",
    },
  });
  const { profile } = useProfile();
  const selectedChannel = profile;
  const [selectedCurrencySymbol, setSelectedCurrencySymbol] =
    useState("WMATIC");

  useEffect(() => {
    if (
      uploadedVideo.collectModule.isLimitedFeeCollect ||
      uploadedVideo.collectModule.isLimitedTimeFeeCollect
    ) {
      register("collectLimit");
    } else {
      unregister("collectLimit");
    }
  }, [uploadedVideo.collectModule, register, unregister]);

  const getCurrencySymbol = (currencies: Erc20[], address: string) => {
    return currencies.find((c) => c.address === address)?.symbol as string;
  };

  const { data: enabledCurrencies } = useQuery(MODULES_CURRENCY_QUERY, {
    variables: { request: { profileIds: selectedChannel?.id } },
    skip: !selectedChannel?.id,
  });

  const onSubmit = (data: FormData) => {
    setCollectType({
      amount: { currency: data.currency, value: data.amount.toString() },
      referralFee: data.referralPercent,
      recipient: selectedChannel?.ownedBy,
      collectLimit: data.collectLimit,
    });
  };

  return (
    <form className="space-y-3">
      <VStack m={"1rem 0.5rem"}>
        <Box>
          <Box className="flex items-center mb-1 space-x-1.5">
            <Text fontSize={"lg"}>Currency</Text>
          </Box>
          <Box boxShadow={"base"} p="5px" borderRadius={"25px"}>
            <select
              autoComplete="off"
              className={clsx(
                "bg-white text-sm p-2.5 rounded-xl dark:bg-gray-900 border border-gray-200 dark:border-gray-800 disabled:opacity-60 disabled:bg-gray-500 disabled:bg-opacity-20 outline-none w-full"
              )}
              {...register("currency")}
              value={uploadedVideo.collectModule.amount?.currency}
              onChange={(e) => {
                setCollectType({
                  amount: { currency: e.target.value, value: "" },
                });
                setSelectedCurrencySymbol(
                  getCurrencySymbol(
                    enabledCurrencies.enabledModuleCurrencies,
                    e.target.value
                  )
                );
              }}
            >
              {enabledCurrencies?.enabledModuleCurrencies?.map(
                (currency: Erc20) => (
                  <option key={currency.address} value={currency.address}>
                    {currency.symbol}
                  </option>
                )
              )}
            </select>
          </Box>
        </Box>

        <Box>
          <Input
            variant={"filled"}
            bg="white"
            boxShadow="base"
            w="100%"
            type="number"
            placeholder="Price"
            min="0"
            autoComplete="off"
            max="100000"
            suffix={selectedCurrencySymbol}
            validationError={errors.amount?.message}
            {...register("amount", {
              setValueAs: (v) => String(v),
            })}
          />
        </Box>
        <Box>
          <Input
            variant={"filled"}
            bg="white"
            boxShadow="base"
            w="100%"
            placeholder="Referral Percentage"
            type="number"
            suffix="%"
            autoComplete="off"
            {...register("referralPercent", { valueAsNumber: true })}
            validationError={errors.referralPercent?.message}
          />
        </Box>
        {uploadedVideo.collectModule.isLimitedFeeCollect ||
        uploadedVideo.collectModule.isLimitedTimeFeeCollect ? (
          <Box>
            <Input
              variant={"filled"}
              bg="white"
              boxShadow="base"
              w="100%"
              type="number"
              placeholder="Collect Limit"
              min="0"
              autoComplete="off"
              validationError={errors.collectLimit?.message}
              {...register("collectLimit", {
                setValueAs: (v) => String(v),
              })}
            />
          </Box>
        ) : null}
        <Box className="flex justify-end">
          <Button type="button" onClick={() => handleSubmit(onSubmit)()}>
            Set Collect Type
          </Button>
        </Box>
      </VStack>
    </form>
  );
};

export default FeeCollectForm;
