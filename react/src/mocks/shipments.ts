/* eslint-disable indent */
import { BoxState, ShipmentState, TransferAgreementType } from "types/generated/graphql";
import { base1, base2 } from "./bases";
import { generateMockBox } from "./boxes";
import { generateMockLocationWithBase } from "./locations";
import { product1, product3 } from "./products";
import { size1, size2 } from "./sizeRanges";
import { user1 } from "./users";

export const shipment1 = {
  details: [
    {
      sourceProduct: product1,
      box: generateMockBox({
        labelIdentifier: "123",
        numberOfItems: 10,
        product: product1,
      }),
    },
    {
      sourceProduct: product3,
      box: generateMockBox({
        labelIdentifier: "124",
        numberOfItems: 12,
        product: product3,
      }),
    },
  ],
  id: "1",
  state: ShipmentState.Preparing,
  sentBy: null,
  sourceBase: {
    id: "1",
    name: "Lesvos",
    organisation: {
      id: "1",
      name: "BoxAid",
    },
  },
  targetBase: {
    id: 2,
    name: "Thessaloniki",
    organisation: {
      id: "2",
      name: "BoxCare",
    },
  },
  transferAgreement: {
    id: "1",
    type: TransferAgreementType.Bidirectional,
    comment: "",
  },
};

export const shipment2 = {
  details: [],
  id: "1",
  state: ShipmentState.Preparing,
  sentBy: null,
  sourceBase: {
    id: "1",
    name: "Lesvos",
    organisation: {
      id: "1",
      name: "BoxAid",
    },
  },
  targetBase: {
    id: "2",
    name: "Thessaloniki",
    organisation: {
      id: "2",
      name: "BoxCare",
    },
  },
  transferAgreement: {
    id: "1",
    type: TransferAgreementType.Bidirectional,
    comment: "",
  },
};

export const shipments = [shipment1];

export const generateMockShipment = ({
  state = ShipmentState.Preparing,
  iAmSource = true,
  hasBoxes = true,
}) => ({
  id: "1",
  state,
  details: hasBoxes
    ? [
        {
          id: "1",
          box: generateMockBox({
            labelIdentifier: "123",
            numberOfItems: 10,
            product: product1,
            location: generateMockLocationWithBase({}),
          }),
          sourceSize: size1,
          sourceQuantity: 10,
          sourceProduct: product1,
          targetProduct: null,
          createdOn: "2023-01-09T17:24:29+00:00",
          createdBy: user1,
          removedOn: "2023-01-10T17:24:29+00:00",
          removedBy: user1,
          __typename: "ShipmentDetail",
        },
        {
          id: "2",
          box: generateMockBox({
            labelIdentifier: "123",
            numberOfItems: 10,
            product: product1,
          }),
          sourceSize: size1,
          sourceQuantity: 10,
          sourceProduct: product1,
          targetProduct: null,
          createdOn: "2023-01-11T17:24:29+00:00",
          createdBy: user1,
          receivedOn: state === ShipmentState.Completed ? "2023-01-14T17:24:29+00:00" : null,
          receivedBy: state === ShipmentState.Completed ? user1 : null,
          removedOn: null,
          removedBy: null,
          lostOn: null,
          lostBy: null,
          __typename: "ShipmentDetail",
        },
        {
          id: "3",
          box: generateMockBox({
            labelIdentifier: "124",
            numberOfItems: 12,
            product: product3,
            state:
              // eslint-disable-next-line no-nested-ternary
              state === ShipmentState.Receiving
                ? BoxState.Receiving
                : state === ShipmentState.Sent
                ? BoxState.InTransit
                : BoxState.MarkedForShipment,
          }),
          sourceSize: size2,
          sourceQuantity: 12,
          sourceProduct: product3,
          targetProduct: null,
          createdOn: "2023-02-01T17:24:29+00:00",
          createdBy: user1,
          receivedOn: state === ShipmentState.Completed ? "2023-01-14T17:24:29+00:00" : null,
          receivedBy: state === ShipmentState.Completed ? user1 : null,
          lostOn: null,
          lostBy: null,
          removedOn: null,
          removedBy: null,
          __typename: "ShipmentDetail",
        },
      ]
    : [],
  sourceBase: iAmSource ? base1 : base2,
  targetBase: iAmSource ? base2 : base1,
  transferAgreement: {
    id: "1",
    comment: "",
    type: TransferAgreementType.Bidirectional,
    __typename: "TransferAgreement",
  },
  startedOn: "2023-01-08T17:24:29+00:00",
  startedBy: user1,
  sentOn: null,
  sentBy: null,
  receivingStartedOn: null,
  receivingStartedBy: null,
  completedOn: null,
  completedBy: null,
  canceledOn: null,
  canceledBy: null,
  __typename: "Shipment",
});

export const generateMockShipmentMinimal = ({
  state = ShipmentState.Preparing,
  iAmSource = true,
}) => {
  const shipment = {
    id: "1",
    state,
    sourceBase: iAmSource ? base1 : base2,
    targetBase: iAmSource ? base2 : base1,
  };

  return shipment;
};

export const generateMockShipmentWithCustomDetails = ({
  state = ShipmentState.Preparing,
  iAmSource = true,
  details = [generateMockShipmentDetail({})],
}) => ({
  id: "1",
  state,
  details,
  sourceBase: iAmSource ? base1 : base2,
  targetBase: iAmSource ? base2 : base1,
  transferAgreement: {
    id: "1",
    comment: "",
    type: TransferAgreementType.Bidirectional,
    __typename: "TransferAgreement",
  },
  startedOn: "2023-01-08T17:24:29+00:00",
  startedBy: user1,
  sentOn: null,
  sentBy: null,
  receivingStartedOn: null,
  receivingStartedBy: null,
  completedOn: null,
  completedBy: null,
  canceledOn: null,
  canceledBy: null,
  __typename: "Shipment",
});

export const generateMockShipmentDetail = ({
  id = "1",
  box = generateMockBox({
    labelIdentifier: "123",
    numberOfItems: 10,
    product: product1,
    location: generateMockLocationWithBase({}),
  }),
  sourceQuantity = 10,
  sourceSize = size1,
  sourceProduct = product1,
  targetProduct = null,
  createdOn = "2023-01-09T17:24:29+00:00",
  createdBy = user1,
  removedOn = null,
  removedBy = null,
}) => ({
  id,
  box,
  sourceSize,
  sourceQuantity,
  sourceProduct,
  targetProduct,
  createdOn,
  createdBy,
  removedOn,
  removedBy,
  __typename: "ShipmentDetail",
});
