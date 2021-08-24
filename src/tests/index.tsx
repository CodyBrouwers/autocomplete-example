/* eslint-disable react/function-component-definition */
import React, { FC, ReactElement } from "react";
import { render as originalRender, RenderOptions } from "@testing-library/react";

// == Types ================================================================

// == Constants ============================================================

const Providers: FC = ({ children }) => {
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
};

// == Exports ==============================================================

export const render = (ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) =>
  originalRender(ui, { wrapper: Providers, ...options });
export * from "@testing-library/react";
