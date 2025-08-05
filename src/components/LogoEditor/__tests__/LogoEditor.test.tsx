import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LogoEditor from '../LogoEditor';

// Mock props
const mockProps = {
  selectedTemplate: null,
  logoData: {
    businessName: 'Test Business',
    tagline: 'Test Tagline',
    primaryColor: '#000000',
    secondaryColor: '#ffffff',
    fontFamily: 'Arial',
  },
  onLogoDataChange: jest.fn(),
};

describe('LogoEditor', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('initializes canvas successfully', async () => {
    render(<LogoEditor {...mockProps} />);
    
    // Check if canvas element is rendered
    const canvas = screen.getByRole('img', { name: /canvas/i });
    expect(canvas).toBeInTheDocument();
    
    // Wait for canvas to be ready
    await waitFor(() => {
      expect(screen.getByText(/canvas ready/i)).toBeInTheDocument();
    });
  });

  test('adds text element when Add Text button is clicked', async () => {
    render(<LogoEditor {...mockProps} />);
    
    // Wait for canvas to be ready
    await waitFor(() => {
      expect(screen.getByText(/canvas ready/i)).toBeInTheDocument();
    });
    
    // Click Add Text button
    const addTextBtn = screen.getByRole('button', { name: /add text/i });
    fireEvent.click(addTextBtn);
    
    // Check if text controls appear
    expect(screen.getByText(/text properties/i)).toBeInTheDocument();
  });

  test('adds shape when shape button is clicked', async () => {
    render(<LogoEditor {...mockProps} />);
    
    // Wait for canvas to be ready
    await waitFor(() => {
      expect(screen.getByText(/canvas ready/i)).toBeInTheDocument();
    });
    
    // Click rectangle shape button
    const rectangleBtn = screen.getByRole('button', { name: /rectangle/i });
    fireEvent.click(rectangleBtn);
    
    // Check if shape controls appear
    expect(screen.getByText(/shape properties/i)).toBeInTheDocument();
  });

  test('handles color changes', async () => {
    render(<LogoEditor {...mockProps} />);
    
    // Wait for canvas to be ready
    await waitFor(() => {
      expect(screen.getByText(/canvas ready/i)).toBeInTheDocument();
    });
    
    // Change primary color
    const colorPicker = screen.getByLabelText(/primary color/i);
    fireEvent.change(colorPicker, { target: { value: '#ff0000' } });
    
    // Verify color change was passed to parent
    expect(mockProps.onLogoDataChange).toHaveBeenCalledWith(
      expect.objectContaining({
        primaryColor: '#ff0000',
      })
    );
  });

  test('exports logo with watermark for free tier', async () => {
    render(<LogoEditor {...mockProps} />);
    
    // Wait for canvas to be ready
    await waitFor(() => {
      expect(screen.getByText(/canvas ready/i)).toBeInTheDocument();
    });
    
    // Click export button
    const exportBtn = screen.getByRole('button', { name: /download free preview/i });
    fireEvent.click(exportBtn);
    
    // Verify watermark is added
    expect(screen.getByText(/logogen/i)).toBeInTheDocument();
  });

  test('handles layer management', async () => {
    render(<LogoEditor {...mockProps} />);
    
    // Wait for canvas to be ready
    await waitFor(() => {
      expect(screen.getByText(/canvas ready/i)).toBeInTheDocument();
    });
    
    // Add text and shape
    fireEvent.click(screen.getByRole('button', { name: /add text/i }));
    fireEvent.click(screen.getByRole('button', { name: /rectangle/i }));
    
    // Open layers panel
    fireEvent.click(screen.getByRole('button', { name: /layers/i }));
    
    // Check if both layers are listed
    expect(screen.getByText(/text 1/i)).toBeInTheDocument();
    expect(screen.getByText(/rectangle 1/i)).toBeInTheDocument();
    
    // Test layer visibility toggle
    const visibilityBtn = screen.getAllByRole('button', { name: /hide/i })[0];
    fireEvent.click(visibilityBtn);
    expect(screen.getByRole('button', { name: /show/i })).toBeInTheDocument();
  });
});
