// store/slices/dataSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export type Item = {
  id: string;
  creator: string;
  title: string;
  pricingOption: number; // 0: Free, 1: Paid, 2: View Only
  imagePath: string;
  price: number;
};

interface DataState {
  items: Item[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: DataState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchData = createAsyncThunk<Item[], void>(
  'data/fetchData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('https://closet-recruiting-api.azurewebsites.net/api/data');
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }
      const data: Item[] = await response.json();

      return data.map(item => ({
        ...item,
        price: item.price ?? 0,
        imagePath: item.imagePath ?? '/src/assets/default-image.jpg' // Provide a default image path if needed
      }));
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchData.fulfilled, (state, action: PayloadAction<Item[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to fetch data';
      });
  },
});

export default dataSlice.reducer;