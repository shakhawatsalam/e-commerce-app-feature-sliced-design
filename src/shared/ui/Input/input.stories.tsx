import type { Meta, StoryObj } from "@storybook/react-vite";

import SearchIcon from "../../assets/icons/Search.svg?react";
import { AppIcon } from "../AppIcon/AppIcon";

import { Input } from "./Input";

const meta = {
  title: "shared/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: { value: "", placeholder: "Enter text..." },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Default",
  },
};

export const WithValue: Story = {
  args: {
    value: "Some Value",
  },
};

export const Password: Story = {
  args: {
    type: "password",
    value: "123",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const Rounded: Story = {
  args: {
    form: "rounded",
  },
};

export const WithIcon: Story = {
  args: {
    Icon: <AppIcon size={20} Icon={SearchIcon} />,
  },
};





