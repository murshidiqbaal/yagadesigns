import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { uploadProductImage, storage } from '@/lib/appwrite';

// Mock the Appwrite SDK
vi.mock('appwrite', () => {
  const mockCreateFile = vi.fn().mockResolvedValue({ $id: 'mock-file-id' });
  return {
    Client: vi.fn().mockImplementation(() => ({
      setEndpoint: vi.fn().mockReturnThis(),
      setProject: vi.fn().mockReturnThis(),
    })),
    Account: vi.fn(),
    Databases: vi.fn(),
    Storage: vi.fn().mockImplementation(() => ({
      createFile: mockCreateFile,
    })),
    ID: {
      unique: vi.fn().mockReturnValue('unique-id'),
    },
    Query: {},
  };
});

describe('WebP Optimization and Image Uploads', () => {
  let originalCreateElement: typeof document.createElement;
  let originalFileReader: typeof globalThis.FileReader;
  let originalImage: typeof globalThis.Image;

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock Canvas and document.createElement
    originalCreateElement = document.createElement;
    document.createElement = vi.fn().mockImplementation((tagName: string) => {
      if (tagName === 'canvas') {
        return {
          width: 0,
          height: 0,
          getContext: () => ({
            drawImage: vi.fn(),
          }),
          toBlob: vi.fn().mockImplementation((callback) => {
            callback(new Blob(['fake webp data'], { type: 'image/webp' }));
          }),
        };
      }
      return originalCreateElement.call(document, tagName);
    }) as any;

    // Mock FileReader
    originalFileReader = globalThis.FileReader;
    globalThis.FileReader = class MockFileReader {
      onload: (e: any) => void = () => {};
      onerror: (e: any) => void = () => {};
      readAsDataURL(file: File) {
        setTimeout(() => {
          this.onload({ target: { result: 'data:image/png;base64,mockdata' } });
        }, 0);
      }
    } as any;

    // Mock Image
    originalImage = globalThis.Image;
    globalThis.Image = class MockImage {
      onload: () => void = () => {};
      onerror: () => void = () => {};
      src: string = '';
      width: number = 100;
      height: number = 100;
      constructor() {
        setTimeout(() => this.onload(), 0);
      }
    } as any;
  });

  afterEach(() => {
    document.createElement = originalCreateElement;
    globalThis.FileReader = originalFileReader;
    globalThis.Image = originalImage;
  });

  it('should convert JPEG to WebP and upload', async () => {
    const file = new File(['dummy jpeg content'], 'test.jpeg', { type: 'image/jpeg' });
    const mockCreateFile = storage.createFile as any;

    await uploadProductImage(file);

    expect(mockCreateFile).toHaveBeenCalledTimes(1);
    const [, , uploadedFile] = mockCreateFile.mock.calls[0];
    expect(uploadedFile.type).toBe('image/webp');
    expect(uploadedFile.name).toBe('test.webp');
  });

  it('should convert PNG to WebP and upload', async () => {
    const file = new File(['dummy png content'], 'photo.png', { type: 'image/png' });
    const mockCreateFile = storage.createFile as any;

    await uploadProductImage(file);

    expect(mockCreateFile).toHaveBeenCalledTimes(1);
    const [, , uploadedFile] = mockCreateFile.mock.calls[0];
    expect(uploadedFile.type).toBe('image/webp');
    expect(uploadedFile.name).toBe('photo.webp');
  });

  it('should convert BMP to WebP and upload', async () => {
    const file = new File(['dummy bmp content'], 'artwork.bmp', { type: 'image/bmp' });
    const mockCreateFile = storage.createFile as any;

    await uploadProductImage(file);

    expect(mockCreateFile).toHaveBeenCalledTimes(1);
    const [, , uploadedFile] = mockCreateFile.mock.calls[0];
    expect(uploadedFile.type).toBe('image/webp');
    expect(uploadedFile.name).toBe('artwork.webp');
  });

  it('should NOT convert SVG and upload the original file', async () => {
    const file = new File(['<svg></svg>'], 'logo.svg', { type: 'image/svg+xml' });
    const mockCreateFile = storage.createFile as any;

    await uploadProductImage(file);

    expect(mockCreateFile).toHaveBeenCalledTimes(1);
    const [, , uploadedFile] = mockCreateFile.mock.calls[0];
    expect(uploadedFile.type).toBe('image/svg+xml');
    expect(uploadedFile.name).toBe('logo.svg');
  });

  it('should NOT convert GIF and upload the original file', async () => {
    const file = new File(['dummy gif content'], 'loader.gif', { type: 'image/gif' });
    const mockCreateFile = storage.createFile as any;

    await uploadProductImage(file);

    expect(mockCreateFile).toHaveBeenCalledTimes(1);
    const [, , uploadedFile] = mockCreateFile.mock.calls[0];
    expect(uploadedFile.type).toBe('image/gif');
    expect(uploadedFile.name).toBe('loader.gif');
  });

  it('should NOT convert WebP and upload the original file', async () => {
    const file = new File(['dummy webp content'], 'already-optimized.webp', { type: 'image/webp' });
    const mockCreateFile = storage.createFile as any;

    await uploadProductImage(file);

    expect(mockCreateFile).toHaveBeenCalledTimes(1);
    const [, , uploadedFile] = mockCreateFile.mock.calls[0];
    expect(uploadedFile.type).toBe('image/webp');
    expect(uploadedFile.name).toBe('already-optimized.webp');
  });
});
