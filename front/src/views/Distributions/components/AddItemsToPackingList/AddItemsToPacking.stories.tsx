import { StoryFn, Meta } from "@storybook/react";
import AddItemsToPackingList, { ProductDataForPackingList } from "./AddItemsToPackingList";

const clothingCategory = {
  id: "1",
  name: "Clothing",
};

const hygenicCategory = {
  id: "2",
  name: "Hygenic",
};

const mockedProductData: ProductDataForPackingList[] = [
  {
    id: "1",
    name: "Jacket",
    category: { ...clothingCategory },
    gender: ProductGender.Men,
  },
  {
    id: "2",
    name: "T-shirt",
    category: { ...clothingCategory },
    gender: ProductGender.Men,
  },
  {
    id: "3",
    name: "Skirt",
    category: { ...clothingCategory },
    gender: ProductGender.Women,
  },
  {
    id: "10",
    name: "Razor (50 pack)",
    category: { ...hygenicCategory },
    gender: ProductGender.Men,
  },
];

export default {
  title: "Mobile Distro Events/Distro Events/Add Items to Packing List/Component",
  component: AddItemsToPackingList,
  parameters: {},
} as Meta<typeof AddItemsToPackingList>;

const Template: StoryFn<typeof AddItemsToPackingList> = (args) => (
  <AddItemsToPackingList {...args} />
);

export const Default = Template.bind({});
Default.args = {
  productData: mockedProductData,
};
