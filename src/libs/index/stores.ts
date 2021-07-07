import { writable } from 'svelte/store';

export const board = writable<number[][]>([]);