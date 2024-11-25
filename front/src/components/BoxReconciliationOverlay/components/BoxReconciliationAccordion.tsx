import { Accordion, AccordionButton, AccordionItem, AccordionPanel, Box } from "@chakra-ui/react";
import { useState } from "react";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { RiQuestionFill } from "react-icons/ri";
import { ILocationData, IProductWithSizeRangeData } from "./BoxReconciliationView";
import { IMatchProductsFormData, MatchProductsForm } from "./MatchProductsForm";
import { IReceiveLocationFormData, ReceiveLocationForm } from "./ReceiveLocationForm";
import { ShipmentDetail } from "types/query-types";

interface IBoxReconcilationAccordionProps {
  shipmentDetail: ShipmentDetail;
  productAndSizesData: IProductWithSizeRangeData[];
  allLocations: ILocationData[];
  loading: boolean;
  onBoxUndelivered: (labelIdentifier: string) => void;
  onBoxDelivered: (
    labelIdentifier: string,
    locationId: number,
    productId: number,
    sizeId: number,
    numberOfItems: number,
  ) => void;
}

export interface IProductFormData {
  productId: number | undefined;
  sizeId: number | undefined;
  numberOfItems: number | undefined;
}

export interface ILocationFormData {
  locationId: number | undefined;
}

export function BoxReconcilationAccordion({
  shipmentDetail,
  productAndSizesData,
  allLocations,
  loading,
  onBoxUndelivered,
  onBoxDelivered,
}: IBoxReconcilationAccordionProps) {
  const [accordionIndex, setAccordionIndex] = useState(0);
  const [productMatched, setProductMatched] = useState<boolean>(false);
  const [locationSpecified, setLocationSpecified] = useState<boolean>(false);
  const [productFormData, setProductFormData] = useState<IProductFormData>({
    productId: undefined,
    sizeId: undefined,
    numberOfItems: undefined,
  });

  return (
    <Accordion allowToggle index={accordionIndex}>
      <AccordionItem>
        <h2>
          <AccordionButton
            p={4}
            borderBottomWidth={1}
            onClick={() => setAccordionIndex(0)}
            color={!productMatched ? "#000" : "#659A7E"}
          >
            <Box flex="1" textAlign="left" fontWeight="bold">
              1. {!productMatched && "MATCH PRODUCTS"}
              {productMatched && "PRODUCTS DELIVERED"}
            </Box>
            {!productMatched && <RiQuestionFill size={20} />}
            {productMatched && <BsFillCheckCircleFill color="#659A7E" size={18} />}
          </AccordionButton>
        </h2>
        <AccordionPanel p={6}>
          <MatchProductsForm
            loading={loading}
            shipmentDetail={shipmentDetail}
            productAndSizesData={productAndSizesData}
            onBoxUndelivered={onBoxUndelivered}
            onSubmitMatchProductsForm={(matchedProductsFormData: IMatchProductsFormData) => {
              setProductMatched(true);
              setAccordionIndex(1);
              setProductFormData({
                sizeId: parseInt(matchedProductsFormData.sizeId.value, 10),
                productId: parseInt(matchedProductsFormData.productId.value, 10),
                numberOfItems: matchedProductsFormData.numberOfItems,
              });
            }}
          />
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <h2>
          <AccordionButton
            color={!locationSpecified ? "#000" : "#659A7E"}
            p={4}
            borderBottomWidth={1}
            onClick={() => setAccordionIndex(1)}
          >
            <Box flex="1" textAlign="left" fontWeight="bold">
              2. RECEIVE LOCATION
            </Box>
            {!locationSpecified && <RiQuestionFill size={20} />}
            {locationSpecified && <BsFillCheckCircleFill color="#659A7E" size={18} />}
          </AccordionButton>
        </h2>
        <AccordionPanel p={6}>
          <ReceiveLocationForm
            loading={loading}
            onLocationSpecified={setLocationSpecified}
            allLocations={allLocations}
            onSubmitReceiveLocationForm={(receiveLocationFormData: IReceiveLocationFormData) => {
              setLocationSpecified(true);
              setAccordionIndex(-1);

              onBoxDelivered(
                shipmentDetail.box.labelIdentifier,
                parseInt(receiveLocationFormData.locationId.value, 10),
                productFormData.productId!,
                productFormData.sizeId!,
                productFormData.numberOfItems!,
              );
            }}
          />
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}
