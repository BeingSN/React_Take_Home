import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";

// Mock the fetch function
global.fetch = jest.fn();

describe("App Component", () => {
  const mockUsers = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
    { id: 3, name: "Bob Johnson" },
  ];

  beforeEach(() => {
    // Reset mock between tests
    fetch.mockReset();

    // Mock the fetch response
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

    // Verify the fetch was called with the correct URL
    expect(fetch).toHaveBeenCalledWith(
      "https://jsonplaceholder.typicode.com/users"
    );

    // Wait for the users to be displayed
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

    // Type in the search input
    const searchInput = screen.getByPlaceholderText("Search users...");
    fireEvent.change(searchInput, { target: { value: "john" } });

    // Check that only matching users are displayed
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.queryByText("Jane Smith")).not.toBeInTheDocument();
    expect(screen.queryByText("Bob Johnson")).not.toBeInTheDocument();
  });

  test("is case insensitive when filtering users", async () => {
    render(<App />);

    // Wait for users to load
    await waitFor(() => {
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    });

    // Type in the search input with mixed case
    const searchInput = screen.getByPlaceholderText("Search users...");
    fireEvent.change(searchInput, { target: { value: "jAnE" } });

    // Check that the matching user is displayed despite different case
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
    expect(screen.queryByText("Bob Johnson")).not.toBeInTheDocument();
  });

  test("shows all users when search is cleared", async () => {
    render(<App />);

    // Wait for users to load
    await waitFor(() => {
      expect(screen.getAllByRole("listitem").length).toBe(3);
    });

    // Filter users
    const searchInput = screen.getByPlaceholderText("Search users...");
    fireEvent.change(searchInput, { target: { value: "john" } });

    // Verify filtering worked
    expect(screen.getAllByRole("listitem").length).toBe(1);

    // Clear the search
    fireEvent.change(searchInput, { target: { value: "" } });

    // Verify all users are shown again
    expect(screen.getAllByRole("listitem").length).toBe(3);
  });

  test("handles API errors gracefully", async () => {
    // Override the mock to simulate an error
    fetch.mockRejectedValueOnce(new Error("API error"));

    // Spy on console.error
    jest.spyOn(console, "error").mockImplementation(() => {});

    render(<App />);

    // Wait for potential error handling to complete
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    // Since your component doesn't have explicit error handling,
    // we're mainly checking that it doesn't crash
    expect(screen.getByPlaceholderText("Search users...")).toBeInTheDocument();

    // Restore console.error
    console.error.mockRestore();
  });
});
