import { StoryFn, Meta } from "@storybook/react";
import DistroEventDetailsForPackingState from "./DistroEventDetailsForPackingState";
// import { DistroEvent } from "../State1Planning/DistroEventPlanning";
import { BoxData, IPackingListEntryForPackingState } from "views/Distributions/types";

const mockedBoxesData: BoxData[] = [
  {
    __typename: "Box",
    labelIdentifier: "23982",
    product: {
      id: "3",
      name: "Jacket Woman",
    },
    size: {
      id: "1",
      label: "M",
    },
    numberOfItems: 42,
  },
  {
    __typename: "Box",
    labelIdentifier: "23942",
    product: {
      id: "2",
      name: "Jacket Male",
    },
    size: {
      id: "2",
      label: "S",
    },
    numberOfItems: 23,
  },
];

const mockedDistroEventPackingList: IPackingListEntryForPackingState[] = [
  {
    id: "3",
    numberOfItems: 32,
    size: {
      id: "123",
      label: "M",
    },
    product: {
      id: "1",
      name: "T-shirt",
      gender: ProductGender.Men,
    },
    matchingPackedItemsCollections: mockedBoxesData,
  },
  {
    id: "4",
    numberOfItems: 10,
    size: {
      id: "234",
      label: "S",
    },
    product: {
      id: "2",
      name: "T-shirt",
      gender: ProductGender.Women,
    },
    matchingPackedItemsCollections: [],
  },
];

export default {
  title: "Mobile Distro Events/Distro Events/Detail View/State: 4 - Packing/Component",
  component: DistroEventDetailsForPackingState,
  parameters: {},
} as Meta<typeof DistroEventDetailsForPackingState>;

const Template: StoryFn<typeof DistroEventDetailsForPackingState> = (args) => (
  <DistroEventDetailsForPackingState {...args} />
);

export const Default = Template.bind({});
Default.args = {
  packingListEntries: mockedDistroEventPackingList,
  // boxData: mockedBoxData,
  // boxesData: mockedBoxesData,
  // onShowListClick: action('onShowListClick'),
  // packingActionProps: mockedPackingActionProps,
  // packingActionListProps: mockedPackingActionListProps,
  //   onCheckboxClick: action('onCheckboxClick'),
};
