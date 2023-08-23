import "@testing-library/jest-dom";
import { screen, render, waitFor } from "tests/test-utils";
import { organisation1 } from "mocks/organisations";
import { GraphQLError } from "graphql";
import { generateMockShipment } from "mocks/shipments";
import { ShipmentState } from "types/generated/graphql";
import { useErrorHandling } from "hooks/useErrorHandling";
import { useNotification } from "hooks/useNotification";
import ShipmentView, { SHIPMENT_BY_ID_QUERY } from "./ShipmentView";

const mockedTriggerError = jest.fn();
const mockedCreateToast = jest.fn();
jest.mock("hooks/useErrorHandling");
jest.mock("hooks/useNotification");

const initialQuery = {
  request: {
    query: SHIPMENT_BY_ID_QUERY,
    variables: {
      id: "1",
    },
  },
  result: {
    data: {
      shipment: generateMockShipment({ state: ShipmentState.Preparing }),
    },
  },
};

const initialWithoutBoxQuery = {
  request: {
    query: SHIPMENT_BY_ID_QUERY,
    variables: {
      id: "1",
    },
  },
  result: {
    data: {
      shipment: generateMockShipment({ state: ShipmentState.Preparing, hasBoxes: false }),
    },
  },
};

const initialCompletedShipemntQuery = {
  request: {
    query: SHIPMENT_BY_ID_QUERY,
    variables: {
      id: "1",
    },
  },
  result: {
    data: {
      shipment: generateMockShipment({ state: ShipmentState.Completed, hasBoxes: true }),
    },
  },
};

const initialQueryNetworkError = {
  request: {
    query: SHIPMENT_BY_ID_QUERY,
    variables: {
      id: "1",
    },
  },
  result: {
    errors: [new GraphQLError("Error!")],
  },
};

const initialRecevingUIAsSourceOrgQuery = {
  request: {
    query: SHIPMENT_BY_ID_QUERY,
    variables: {
      id: "1",
    },
  },
  result: {
    data: {
      shipment: generateMockShipment({
        state: ShipmentState.Receiving,
        iAmSource: true,
        hasBoxes: true,
      }),
    },
  },
};

const initialRecevingUIAsTargetOrgQuery = {
  request: {
    query: SHIPMENT_BY_ID_QUERY,
    variables: {
      id: "1",
    },
  },
  result: {
    data: {
      shipment: generateMockShipment({
        state: ShipmentState.Receiving,
        iAmSource: false,
        hasBoxes: true,
      }),
    },
  },
};

beforeEach(() => {
  const mockedUseErrorHandling = jest.mocked(useErrorHandling);
  mockedUseErrorHandling.mockReturnValue({ triggerError: mockedTriggerError });
  const mockedUseNotification = jest.mocked(useNotification);
  mockedUseNotification.mockReturnValue({ createToast: mockedCreateToast });
});

describe("4.5 Test Cases", () => {
  // Test case 4.5.1
  it("4.5.1 - Initial load of Page", async () => {
    //   const user = userEvent.setup();
    render(<ShipmentView />, {
      routePath: "/bases/:baseId/transfers/shipments/:id",
      initialUrl: "/bases/1/transfers/shipments/1",
      mocks: [initialQuery],
      addTypename: true,
      globalPreferences: {
        dispatch: jest.fn(),
        globalPreferences: {
          organisation: { id: organisation1.id, name: organisation1.name },
          availableBases: organisation1.bases,
        },
      },
    });

    // eslint-disable-next-line testing-library/prefer-presence-queries
    expect(screen.getByTestId("loader")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByRole("tab", { name: /content/i })).toBeInTheDocument();
    });

    const title = screen.getByText(/prepare shipment/i);
    expect(title).toBeInTheDocument();
    // // Test case 4.5.1.1 - Content: Displays Shipment Source and Target Bases
    expect(screen.getByText(/lesvos/i)).toBeInTheDocument();
    expect(screen.getByText(/thessaloniki/i)).toBeInTheDocument();
    // Test case 4.5.1.2 - Content: Displays Shipment status
    expect(screen.getByText(/PREPARING/)).toBeInTheDocument();
    // // Test case 4.5.1.3 - Content: Displays total number of boxes
    expect(screen.getByRole("heading", { name: /\b2\b/i })).toBeInTheDocument();
    // // Test case 4.5.1.5 - Displays Content tab initially
    expect(screen.getByRole("tab", { name: /content/i, selected: true })).toHaveTextContent(
      "Content",
    );
    // Breadcrumbs are there
    expect(screen.getByRole("link", { name: /back to manage shipments/i })).toBeInTheDocument();
  }, 10000);

  // Test case 4.5.1.4
  // eslint-disable-next-line max-len
  it("4.5.1.4 - Content: When shipment does not contains any products display correct message", async () => {
    render(<ShipmentView />, {
      routePath: "/bases/:baseId/transfers/shipments/:id",
      initialUrl: "/bases/1/transfers/shipments/1",
      mocks: [initialWithoutBoxQuery],
      addTypename: true,
      globalPreferences: {
        dispatch: jest.fn(),
        globalPreferences: {
          organisation: { id: organisation1.id, name: organisation1.name },
          availableBases: organisation1.bases,
        },
      },
    });

    await waitFor(() => {
      expect(screen.getByRole("tab", { name: /content/i })).toBeInTheDocument();
    });

    const title = screen.getByText(/prepare shipment/i);
    expect(title).toBeInTheDocument();
    // Test case 4.5.1.4 - Content: When shipment does not contains any products display correct message
    expect(
      screen.getByText(/no boxes have been assigned to this shipment yet!/i),
    ).toBeInTheDocument();
  }, 10000);

  // Test case 4.5.2
  it("4.5.2 - Failed to Fetch Initial Data", async () => {
    render(<ShipmentView />, {
      routePath: "/bases/:baseId/transfers/shipments/:id",
      initialUrl: "/bases/1/transfers/shipments/1",
      mocks: [initialQueryNetworkError],
      addTypename: true,
      globalPreferences: {
        dispatch: jest.fn(),
        globalPreferences: {
          organisation: { id: organisation1.id, name: organisation1.name },
          availableBases: organisation1.bases,
        },
      },
    });

    expect(
      await screen.findByText(/could not fetch Shipment data! Please try reloading the page./i),
    ).toBeInTheDocument();
  });

  // Test case 4.5.3
  it("4.5.3 - Initial load of Receiving UI As Target Organisation", async () => {
    //   const user = userEvent.setup();
    render(<ShipmentView />, {
      routePath: "/bases/:baseId/transfers/shipments/:id",
      initialUrl: "/bases/1/transfers/shipments/1",
      mocks: [initialRecevingUIAsTargetOrgQuery],
      addTypename: true,
      globalPreferences: {
        dispatch: jest.fn(),
        globalPreferences: {
          organisation: { id: organisation1.id, name: organisation1.name },
          availableBases: organisation1.bases,
        },
      },
    });

    // eslint-disable-next-line testing-library/prefer-presence-queries
    expect(screen.getByTestId("loader")).toBeInTheDocument();

    await waitFor(() => {
      const title = screen.getByRole("heading", { name: /receiving shipment/i });
      expect(title);
    });

    // eslint-disable-next-line max-len
    expect(
      screen.getByRole("cell", { name: /124 long sleeves \(12x\) size: mixed/i }),
    ).toBeInTheDocument();
  }, 10000);

  // Test case 4.5.4
  it("4.5.4 - Initial load of Receiving UI As Source Organisation", async () => {
    //   const user = userEvent.setup();
    render(<ShipmentView />, {
      routePath: "/bases/:baseId/transfers/shipments/:id",
      initialUrl: "/bases/1/transfers/shipments/1",
      mocks: [initialRecevingUIAsSourceOrgQuery],
      addTypename: true,
      globalPreferences: {
        dispatch: jest.fn(),
        globalPreferences: {
          organisation: { id: organisation1.id, name: organisation1.name },
          availableBases: organisation1.bases,
        },
      },
    });

    // eslint-disable-next-line testing-library/prefer-presence-queries
    expect(screen.getByTestId("loader")).toBeInTheDocument();

    await waitFor(() => {
      const title = screen.getByRole("heading", { name: /view shipment/i });
      expect(title);
    });
  }, 10000);
});

// Test case 4.5.5
it("4.5.5 - Shows total count of the boxes when shipment completed", async () => {
  //   const user = userEvent.setup();
  render(<ShipmentView />, {
    routePath: "/bases/:baseId/transfers/shipments/:id",
    initialUrl: "/bases/1/transfers/shipments/1",
    mocks: [initialCompletedShipemntQuery],
    addTypename: true,
    globalPreferences: {
      dispatch: jest.fn(),
      globalPreferences: {
        organisation: { id: organisation1.id, name: organisation1.name },
        availableBases: organisation1.bases,
      },
    },
  });

  // eslint-disable-next-line testing-library/prefer-presence-queries
  expect(screen.getByTestId("loader")).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getByRole("tab", { name: /content/i })).toBeInTheDocument();
  });

  const title = screen.getByText(/view shipment/i);
  expect(title).toBeInTheDocument();

  expect(screen.getByText(/COMPLETE/)).toBeInTheDocument();

  expect(screen.getByRole("heading", { name: /\b2\b/i })).toBeInTheDocument();

  expect(screen.getByRole("tab", { name: /content/i, selected: true })).toHaveTextContent(
    "Content",
  );
}, 10000);
