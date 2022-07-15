import styled from "@emotion/styled";

import { color } from "metabase/lib/colors";

import TableFooter from "../TableSimple/TableFooter";
import { CellRoot } from "./ListCell.styled";

export const LIST_ITEM_VERTICAL_GAP = "16px";

export const Root = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;

export const ListItemContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4rem;
  border-radius: 8px;
  box-shadow: 4px 5px 10px 3px ${color("shadow")};

  padding: 0 0.5rem;

  background-color: ${color("bg-white")};

  transition: all 0.1s ease-in-out;

  &:hover {
    cursor: pointer;
    transform: scale(0.97);
  }
`;

export const ListItemContent = styled.div`
  display: flex;
  align-items: center;
`;

// Adding horizontal margin so list item shadows don't get cut in dashboard cards
// Because of overflow: hidden style. We need overflow-y: hidden to limit the number of visible rows
// And it's impossible to combine overflow-x: visible with overflow-y: hidden
// https://stackoverflow.com/questions/6421966/css-overflow-x-visible-and-overflow-y-hidden-causing-scrollbar-issue
export const ContentContainer = styled.div`
  margin: 0 1rem;

  ${ListItemContainer}:not(:first-of-type) {
    margin-top: ${LIST_ITEM_VERTICAL_GAP};
  }
`;

export const Footer = styled(TableFooter)`
  margin-top: 0.5rem;
`;

export const RowActionButtonContainer = styled(CellRoot)`
  padding-left: 0.25rem;
  padding-right: 0.25rem;
`;
