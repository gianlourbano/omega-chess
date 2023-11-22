/**
 * @jest-environment jsdom
 */
import React from "react";
import { render } from "@testing-library/react";
import Page from "./page";

describe("Page", () => {
    it("renders without crashing", () => {
        render(<Page />);
    });
});
