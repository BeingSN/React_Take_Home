import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";

global.fetch = jest.fn();

describe("App Component", () => {
  const mockUsers = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
    { id: 3, name: "Bob Johnson" },
  ];

  beforeEach(() => {
    fetch.mockReset();

    fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockUsers),
    });
  });

  test("renders the search input", () => {
    render(<App />);
    expect(screen.getByPlaceholderText("Search users...")).toBeInTheDocument();
  });

  test("fetches and displays users on initial render", async () => {
    render(<App />);

    expect(fetch).toHaveBeenCalledWith(
      "https://jsonplaceholder.typicode.com/users"
    );

    await waitFor(() => {
      mockUsers.forEach((user) => {
        expect(screen.getByText(user.name)).toBeInTheDocument();
      });
    });
  });

  test("filters users based on search input", async () => {
    render(<App />);

    // Wait for users to load
    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText("Search users...");
    fireEvent.change(searchInput, { target: { value: "john" } });

    // Check that only matching users are displayed
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.queryByText("Jane Smith")).not.toBeInTheDocument();
    expect(screen.queryByText("Bob Johnson")).not.toBeInTheDocument();
  });

  test("is case insensitive when filtering users", async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText("Search users...");
    fireEvent.change(searchInput, { target: { value: "jAnE" } });

    // Check that the matching user is displayed despite different case
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
    expect(screen.queryByText("Bob Johnson")).not.toBeInTheDocument();
  });

  test("shows all users when search is cleared", async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getAllByRole("listitem").length).toBe(3);
    });

    const searchInput = screen.getByPlaceholderText("Search users...");
    fireEvent.change(searchInput, { target: { value: "john" } });

    expect(screen.getAllByRole("listitem").length).toBe(1);

    fireEvent.change(searchInput, { target: { value: "" } });

    expect(screen.getAllByRole("listitem").length).toBe(3);
  });

  test("handles API errors gracefully", async () => {
    fetch.mockRejectedValueOnce(new Error("API error"));

    jest.spyOn(console, "error").mockImplementation(() => {});

    render(<App />);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByPlaceholderText("Search users...")).toBeInTheDocument();

    console.error.mockRestore();
  });
});
