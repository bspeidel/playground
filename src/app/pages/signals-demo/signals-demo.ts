import {
  Component,
  signal,
  computed,
  linkedSignal,
  resource,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AppCurrencyPipe, TranslateHtmlPipe, TranslatePipe } from '../../i18n';
import type { TranslationKey } from '../../i18n/translations';

interface CartItem {
  id: number;
  /**
   * Stable, locale-independent match target for {@link filteredItems}. The
   * user-facing name lives in `nameKey` so the display can be translated
   * without breaking the filter. `null` for items the user typed in.
   */
  name: string;
  nameKey: TranslationKey | null;
  price: number;
  quantity: number;
}

export interface PlanOption {
  id: 'starter' | 'pro' | 'enterprise';
  name: string;
  defaultQty: number;
  pricePerUser: number;
}

@Component({
  selector: 'app-signals-demo',
  imports: [
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatProgressBarModule,
    AppCurrencyPipe,
    TranslatePipe,
    TranslateHtmlPipe,
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

  // 3. Angular 22 linkedSignal() demo
  readonly plans: readonly PlanOption[] = [
    { id: 'starter', name: 'Starter', defaultQty: 1, pricePerUser: 12 },
    { id: 'pro', name: 'Pro', defaultQty: 5, pricePerUser: 29 },
    { id: 'enterprise', name: 'Enterprise', defaultQty: 25, pricePerUser: 79 },
  ];

  readonly selectedPlan = signal<PlanOption>(this.plans[0]);

  // linkedSignal automatically syncs/resets when selectedPlan changes, but remains locally writable!
  readonly planQuantity = linkedSignal({
    source: this.selectedPlan,
    computation: (plan) => plan.defaultQty,
  });

  readonly planTotalPrice = computed(() => this.planQuantity() * this.selectedPlan().pricePerUser);

  // 4. Angular 22 resource() demo (declarative async data loader)
  readonly selectedCategory = signal<'frameworks' | 'tools' | 'patterns'>('frameworks');

  readonly techResource = resource({
    params: () => ({ category: this.selectedCategory() }),
    defaultValue: [] as string[],
    loader: async ({ params, abortSignal }) => {
      await new Promise((res) => setTimeout(res, 300));
      if (abortSignal.aborted) return [];

      const techDb: Record<string, string[]> = {
        frameworks: ['Angular 22.2', 'Angular Material 3', 'RxJS 7.8', 'TypeScript 6.0'],
        tools: ['Vite & esbuild', 'Jest & jsdom', 'ESLint 10', 'Prettier 3', 'Husky & lint-staged'],
        patterns: ['Zoneless CD', 'Signals', 'LinkedSignal', 'Resource API', 'Deferrable Views'],
      };
      return techDb[params.category] || [];
    },
  });

  // 5. Reactive Cart demo
  readonly searchFilter = signal('');
  readonly items = signal<CartItem[]>([
    {
      id: 1,
      name: 'Angular 22 T-Shirt',
      nameKey: 'signals.cart.item.angularTshirt',
      price: 25,
      quantity: 1,
    },
    {
      id: 2,
      name: 'Material 3 Mug',
      nameKey: 'signals.cart.item.materialMug',
      price: 15,
      quantity: 2,
    },
    {
      id: 3,
      name: 'Zoneless Stickers Pack',
      nameKey: 'signals.cart.item.zonelessStickers',
      price: 8,
      quantity: 3,
    },
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

  // linkedSignal actions
  selectPlan(plan: PlanOption) {
    this.selectedPlan.set(plan);
  }

  updatePlanQuantity(delta: number) {
    this.planQuantity.update((qty) => Math.max(1, qty + delta));
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
      this.items.update((items) => [
        ...items,
        { id: Date.now(), name, nameKey: null, price, quantity: 1 },
      ]);
      nameInput.value = '';
      priceInput.value = '';
    }
  }
}
