import type { Meta, StoryObj } from "@storybook/react";
import Input from "../components/Input/Input"; // 수정된 부분

const meta = {
  title: "Input/Input",
  component: Input,
  tags: ["autodocs"],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NormalContent: Story = {
  args: {
    title: "아이디",
    placeholder: "아이디를 입력해주세요",
    isButton: false,
  },
};

export const Password: Story = {
  args: {
    title: "비밀번호",
    placeholder: "8자 이상의 문자 입력 (숫자, 영어, 특수문자 포함)",
    isButton: true,
  },
};