import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import MyOrders from "../pages/MyOrders";
import { databases } from "../lib/appwrite";

// Mock hooks & Appwrite
vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    user: null,
    loading: false,
  }),
}));

vi.mock("@/components/Header", () => ({
  default: () => <div data-testid="header-mock">Header</div>,
}));

vi.mock("@/components/Footer", () => ({
  default: () => <div data-testid="footer-mock">Footer</div>,
}));

vi.mock("@/components/SEO", () => ({
  default: () => <div data-testid="seo-mock">SEO</div>,
}));

vi.mock("../lib/appwrite", () => {
  return {
    client: {
      subscribe: vi.fn(() => vi.fn()),
    },
    databases: {
      getDocument: vi.fn(),
      listDocuments: vi.fn(),
    },
    appwriteConfig: {
      databaseId: "yaga-db",
      ordersCollectionId: "orders",
    },
    getImageUrl: (path: string) => path,
  };
});

describe("MyOrders Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("renders empty state when no orders are found in localStorage", () => {
    render(
      <MemoryRouter>
        <MyOrders />
      </MemoryRouter>
    );

    expect(screen.getByText("No orders found")).toBeInTheDocument();
    expect(screen.getByText("Browse Collections")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter Order ID (e.g. YG-123456)")).toBeInTheDocument();
  });

  it("renders order items from localStorage correctly", () => {
    const mockOrders = [
      {
        $id: "order123",
        order_id: "YG-987654",
        customer_name: "John Doe",
        phone_number: "+919999999999",
        product_id: "prod_1",
        product_name: "Elegant Bridal Gown",
        product_image: "image_url_1",
        selected_color: "Crimson Red",
        quantity: 1,
        status: "New",
        created_at: new Date().toISOString(),
      },
    ];

    localStorage.setItem("my_orders", JSON.stringify(mockOrders));

    render(
      <MemoryRouter>
        <MyOrders />
      </MemoryRouter>
    );

    expect(screen.queryByText("No orders found")).not.toBeInTheDocument();
    expect(screen.getByText("Elegant Bridal Gown")).toBeInTheDocument();
    expect(screen.getByText("YG-987654")).toBeInTheDocument();
    expect(screen.getByText(/Crimson Red/)).toBeInTheDocument();
    expect(screen.getByText(/Qty:/)).toBeInTheDocument();
  });

  it("sorts and displays latest orders first", () => {
    const mockOrders = [
      {
        $id: "order_old",
        order_id: "YG-111111",
        customer_name: "John Old",
        phone_number: "+919999999999",
        product_id: "prod_1",
        product_name: "Older Bridal Gown",
        product_image: "image_url_1",
        selected_color: "Ivory",
        quantity: 1,
        status: "New",
        created_at: "2026-06-10T12:00:00.000Z",
      },
      {
        $id: "order_new",
        order_id: "YG-222222",
        customer_name: "John New",
        phone_number: "+919999999999",
        product_id: "prod_2",
        product_name: "Newer Reception Lehenga",
        product_image: "image_url_2",
        selected_color: "Rose Gold",
        quantity: 1,
        status: "Contacted",
        created_at: "2026-06-11T12:00:00.000Z",
      },
    ];

    localStorage.setItem("my_orders", JSON.stringify(mockOrders));

    render(
      <MemoryRouter>
        <MyOrders />
      </MemoryRouter>
    );

    // Get all order titles
    const headings = screen.getAllByRole("heading", { level: 3 });
    // The first heading should be the newer one
    expect(headings[0].textContent).toBe("Newer Reception Lehenga");
    expect(headings[1].textContent).toBe("Older Bridal Gown");
  });
});
