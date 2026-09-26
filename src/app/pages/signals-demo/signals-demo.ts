import { Component, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

@Component({
  selector: 'app-signals-demo',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatProgressBarModule,
  ],
  templateUrl: './signals-demo.html',
  styleUrl: './signals-demo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignalsDemoPage {
  // 1. Counter demo with signals & computed
  readonly count = signal(0);
  readonly doubleCount = computed(() => this.count() * 2);
  readonly isHighCount = computed(() => this.count() >= 10);

  // 2. Zoneless async reactivity demo
  readonly asyncCounter = signal(0);
  readonly isRunningAsync = signal(false);

  // 3. Reactive Cart demo
  readonly searchFilter = signal('');
  readonly items = signal<CartItem[]>([
    { id: 1, name: 'Angular 22 T-Shirt', price: 25, quantity: 1 },
    { id: 2, name: 'Material 3 Mug', price: 15, quantity: 2 },
    { id: 3, name: 'Zoneless Stickers Pack', price: 8, quantity: 3 },
  ]);

  readonly filteredItems = computed(() => {
    const filter = this.searchFilter().toLowerCase().trim();
    if (!filter) return this.items();
    return this.items().filter((item) => item.name.toLowerCase().includes(filter));
  });

  readonly totalItemsCount = computed(() =>
    this.items().reduce((acc, item) => acc + item.quantity, 0),
  );

  readonly totalPrice = computed(() =>
    this.items().reduce((acc, item) => acc + item.price * item.quantity, 0),
  );

  // Counter actions
  increment() {
    this.count.update((c) => c + 1);
  }

  decrement() {
    this.count.update((c) => Math.max(0, c - 1));
  }

  reset() {
    this.count.set(0);
  }

  // Zoneless demonstration with native setTimeout
  startAsyncCounter() {
    if (this.isRunningAsync()) return;
    this.isRunningAsync.set(true);

    const intervalId = setInterval(() => {
      this.asyncCounter.update((v) => v + 1);
      if (this.asyncCounter() >= 10) {
        clearInterval(intervalId);
        this.isRunningAsync.set(false);
      }
    }, 300);
  }

  resetAsyncCounter() {
    this.asyncCounter.set(0);
    this.isRunningAsync.set(false);
  }

  // Cart actions
  updateQuantity(id: number, delta: number) {
    this.items.update((items) =>
      items.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      }),
    );
  }

  removeItem(id: number) {
    this.items.update((items) => items.filter((item) => item.id !== id));
  }

  addItem(nameInput: HTMLInputElement, priceInput: HTMLInputElement) {
    const name = nameInput.value.trim();
    const price = parseFloat(priceInput.value);

    if (name && !isNaN(price) && price > 0) {
      this.items.update((items) => [...items, { id: Date.now(), name, price, quantity: 1 }]);
      nameInput.value = '';
      priceInput.value = '';
    }
  }
}
