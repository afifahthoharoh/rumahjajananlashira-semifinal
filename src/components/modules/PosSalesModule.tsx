import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, SaleItem } from '../../types';
import {
  Store,
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Receipt,
  QrCode,
  CreditCard,
  Banknote,
  Percent,
  CheckCircle2,
  Scan,
  Sparkles,
  Printer,
  Smartphone,
  User,
  ShoppingBag,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const PosSalesModule: React.FC = () => {
  const {
    products,
    branchStocks,
    currentUser,
    createSaleTransaction,
    setSelectedSaleForPrint,
    t,
    language,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // POS Cart State
  const [cart, setCart] = useState<SaleItem[]>([
    // Default initial demonstration items matching screenshot 1
    {
      productId: products[0]?.id || 'p-01',
      productName: 'Basreng Pedas Daun Jeruk 250gr',
      sku: 'BSR-P250',
      price: 15500,
      hpp: 9000,
      quantity: 2,
      subtotal: 31000,
    },
    {
      productId: products[2]?.id || 'p-03',
      productName: 'Makaroni Pedas Bantet 100gr',
      sku: 'MKR-P100',
      price: 8000,
      hpp: 4500,
      quantity: 5,
      subtotal: 40000,
    },
  ]);

  const [customerName, setCustomerName] = useState('Pelanggan Umum (General Customer)');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerMemberType, setCustomerMemberType] = useState<'REGULER' | 'MEMBER_GOLD' | 'RESELLER'>('REGULER');
  const [voucherCode, setVoucherCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'TUNAI' | 'QRIS' | 'TRANSFER_BANK'>('TUNAI');
  const [cashGiven, setCashGiven] = useState<number>(100000);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Filter available products
  const filteredProducts = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.barcode.includes(searchTerm);
    const matchCat =
      categoryFilter === 'ALL' ||
      p.category.toLowerCase().includes(categoryFilter.toLowerCase());
    return matchSearch && matchCat;
  });

  // Get current stock for current branch
  const getProductStock = (productId: string) => {
    const bs = branchStocks.find(
      (b) => b.productId === productId && b.branchId === currentUser.branchId
    );
    return bs ? bs.stockQty : 50;
  };

  // Add to Cart
  const handleAddToCart = (product: Product) => {
    const existingIndex = cart.findIndex((item) => item.productId === product.id);
    const currentStock = getProductStock(product.id);

    if (existingIndex > -1) {
      const currentQty = cart[existingIndex].quantity;
      if (currentQty >= currentStock) {
        alert(
          language === 'id'
            ? `Perhatian: Stok ${product.name} di cabang ini tersisa ${currentStock} pcs.`
            : `Warning: Stock for ${product.name} is only ${currentStock} pcs.`
        );
        return;
      }
      const updated = [...cart];
      updated[existingIndex].quantity += 1;
      updated[existingIndex].subtotal =
        updated[existingIndex].quantity * updated[existingIndex].price;
      setCart(updated);
    } else {
      if (currentStock < 1) {
        alert(
          language === 'id'
            ? `Maaf, stok ${product.name} di cabang ini habis!`
            : `Sorry, ${product.name} is out of stock!`
        );
        return;
      }
      setCart([
        ...cart,
        {
          productId: product.id,
          productName: product.name,
          sku: product.sku,
          price: product.sellingPrice,
          hpp: product.hpp,
          quantity: 1,
          subtotal: product.sellingPrice,
        },
      ]);
    }
  };

  // Update Cart Quantity
  const handleUpdateQty = (index: number, newQty: number) => {
    if (newQty <= 0) {
      setCart(cart.filter((_, i) => i !== index));
      return;
    }
    const item = cart[index];
    const maxStock = getProductStock(item.productId);
    if (newQty > maxStock) {
      alert(
        language === 'id'
          ? `Stok tidak mencukupi. Tersedia: ${maxStock} pcs.`
          : `Insufficient stock. Available: ${maxStock} pcs.`
      );
      return;
    }

    const updated = [...cart];
    updated[index].quantity = newQty;
    updated[index].subtotal = newQty * updated[index].price;
    setCart(updated);
  };

  // Remove Item
  const handleRemoveFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  // Calculations
  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);

  let discountTotal = 0;
  if (customerMemberType === 'MEMBER_GOLD') {
    discountTotal += Math.round(subtotal * 0.1);
  } else if (customerMemberType === 'RESELLER') {
    discountTotal += Math.round(subtotal * 0.15);
  }
  if (voucherCode.toUpperCase() === 'LASHIRA10') {
    discountTotal += Math.min(20000, Math.round(subtotal * 0.1));
  }

  const grandTotal = Math.max(0, subtotal - discountTotal);
  const changeAmount = paymentMethod === 'TUNAI' ? Math.max(0, cashGiven - grandTotal) : 0;

  // Process Checkout
  const handleCheckout = () => {
    if (cart.length === 0) return;
    if (paymentMethod === 'TUNAI' && cashGiven < grandTotal) {
      alert(
        language === 'id'
          ? `Uang tunai yang diterima (Rp ${cashGiven.toLocaleString('id-ID')}) kurang dari total belanja (Rp ${grandTotal.toLocaleString('id-ID')}).`
          : `Cash received (Rp ${cashGiven.toLocaleString('id-ID')}) is less than total amount (Rp ${grandTotal.toLocaleString('id-ID')}).`
      );
      return;
    }

    const calculatedTotalHpp = cart.reduce(
      (sum, item) => sum + (item.hpp || 0) * item.quantity,
      0
    );
    const calculatedGrossProfit = Math.max(0, grandTotal - calculatedTotalHpp);

    const createdTx = createSaleTransaction({
      branchId: currentUser.branchId || 'BR-PUSAT',
      branchName: currentUser.branchName || 'Cabang Pusat',
      cashierId: currentUser.id,
      cashierName: currentUser.name,
      customerName: customerName.trim() || 'Pelanggan Walk-in',
      customerPhone: customerPhone.trim() || '-',
      customerMemberType,
      items: cart,
      subtotal,
      discountTotal,
      voucherCode: voucherCode.trim() ? voucherCode.trim().toUpperCase() : undefined,
      taxPpn: 0,
      grandTotal,
      totalHpp: calculatedTotalHpp,
      grossProfit: calculatedGrossProfit,
      paymentMethod,
      amountPaid: paymentMethod === 'TUNAI' ? cashGiven : grandTotal,
      changeAmount,
      status: 'BERHASIL',
      notes:
        paymentMethod === 'TUNAI'
          ? `Tunai diterima Rp ${cashGiven.toLocaleString('id-ID')}`
          : `Non-tunai ${paymentMethod}`,
    });

    try {
      confetti({
        particleCount: 70,
        spread: 50,
        origin: { y: 0.7 },
      });
    } catch (err) {}

    setCart([]);
    setSelectedSaleForPrint(createdTx);
  };

  const categories = [
    { id: 'ALL', label: t.pos.allCategories },
    { id: 'Basreng', label: 'Basreng' },
    { id: 'Keripik', label: language === 'id' ? 'Keripik' : 'Chips' },
    { id: 'Makaroni', label: 'Makaroni' },
    { id: 'Seblak', label: 'Seblak' },
    { id: 'Usus', label: language === 'id' ? 'Usus Crispy' : 'Crispy Intestines' },
  ];

  return (
    <div className="space-y-4">
      {/* POS Content Layout: Catalog (Left) & Cart / Bill (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Category Pills & Product Catalog Grid (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Category Pills (matching screenshot 1) */}
          <div className="flex gap-2 overflow-x-auto pb-1 items-center">
            {categories.map((c) => {
              const isActive = categoryFilter === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setCategoryFilter(c.id)}
                  className={`px-5 py-2 rounded-full text-xs font-bold transition whitespace-nowrap active:scale-95 ${
                    isActive
                      ? 'bg-[#A31D1D] text-white shadow-xs'
                      : 'bg-[#FAF2F0] text-stone-700 hover:bg-[#FCEBE8] border border-transparent'
                  }`}
                >
                  {c.label}
                </button>
              );
            })}
          </div>

          {/* Product Cards Grid (matching screenshot 1) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
            {filteredProducts.map((p) => {
              const stock = getProductStock(p.id);
              const isOut = stock < 1;
              const inCart = cart.find((item) => item.productId === p.id);

              return (
                <div
                  key={p.id}
                  onClick={() => !isOut && handleAddToCart(p)}
                  className={`bg-white rounded-2xl p-3 flex flex-col justify-between transition relative cursor-pointer group shadow-2xs hover:shadow-xs ${
                    inCart
                      ? 'border-2 border-[#991B1B]'
                      : 'border border-[#F0E6E5] hover:border-[#991B1B]/60'
                  } ${isOut ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {/* Pouch Image Container */}
                  <div className="relative h-32 rounded-xl bg-[#FCFAF8] flex items-center justify-center overflow-hidden mb-2">
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="w-full h-full object-contain p-1 group-hover:scale-105 transition"
                      referrerPolicy="no-referrer"
                    />

                    {/* Stock Badge on Top of Card */}
                    <div className="absolute top-1.5 left-1.5 right-1.5 flex justify-between items-center">
                      {inCart ? (
                        <span className="bg-[#991B1B] text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                          <Check className="w-2.5 h-2.5" />
                          <span>
                            {t.pos.stock}: {stock}
                          </span>
                        </span>
                      ) : isOut ? (
                        <span className="bg-stone-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                          {t.pos.outOfStock}
                        </span>
                      ) : (
                        <span className="bg-white/90 backdrop-blur-xs text-stone-700 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-2xs border border-stone-200/50">
                          {t.pos.stock}: {stock}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* SKU & Title */}
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-stone-400 font-mono block">
                      SKU: {p.sku}
                    </span>
                    <h4 className="font-bold text-xs text-stone-900 line-clamp-1 leading-snug">
                      {p.name}
                    </h4>
                  </div>

                  {/* Price */}
                  <div className="pt-2 mt-1">
                    <span className="font-black text-xs text-[#991B1B]">
                      Rp {p.sellingPrice.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Cart & Payment Checkout Panel (4 Cols, matching screenshot 1) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-[#F0E6E5] p-4 shadow-xs space-y-4">
          {/* Customer Selection Input */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-stone-600">
              {t.pos.customer}
            </label>
            <div className="flex items-center gap-2 px-3 py-2 bg-[#FAF7F5] border border-[#F0E6E5] rounded-xl text-xs font-semibold text-stone-800">
              <User className="w-4 h-4 text-stone-400 flex-shrink-0" />
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="bg-transparent w-full outline-none text-xs font-medium text-stone-800"
                placeholder={t.pos.generalCustomer}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="space-y-3 min-h-[220px] max-h-[340px] overflow-y-auto pr-1">
            {cart.length === 0 ? (
              <div className="py-12 text-center text-stone-400 space-y-2">
                <ShoppingCart className="w-8 h-8 mx-auto text-stone-300" />
                <p className="text-xs font-medium">{t.pos.emptyCart}</p>
              </div>
            ) : (
              cart.map((item, idx) => {
                const prod = products.find((p) => p.id === item.productId);
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-3 p-2 bg-[#FAF7F5] rounded-xl border border-[#F0E6E5]"
                  >
                    {/* Thumbnail */}
                    <div className="w-12 h-12 rounded-lg bg-white p-1 flex-shrink-0 border border-stone-200/50 flex items-center justify-center">
                      <img
                        src={prod?.imageUrl}
                        alt={item.productName}
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h5 className="font-bold text-xs text-stone-900 truncate">
                          {item.productName}
                        </h5>
                        <button
                          onClick={() => handleRemoveFromCart(idx)}
                          className="text-stone-400 hover:text-[#991B1B] p-0.5 transition"
                          title="Hapus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="font-bold text-xs text-[#991B1B] block mt-0.5">
                        Rp {item.price.toLocaleString('id-ID')}
                      </span>
                    </div>

                    {/* Stepper Pill */}
                    <div className="flex items-center gap-2 bg-white border border-[#F0E6E5] rounded-lg px-2 py-1">
                      <button
                        onClick={() => handleUpdateQty(idx, item.quantity - 1)}
                        className="text-stone-500 hover:text-[#991B1B] transition font-bold"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-bold text-xs text-stone-900 w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQty(idx, item.quantity + 1)}
                        className="text-stone-500 hover:text-[#991B1B] transition font-bold"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Subtotal, Diskon, Total (matching screenshot 1) */}
          <div className="space-y-1.5 pt-3 border-t border-[#F0E6E5] text-xs">
            <div className="flex justify-between text-stone-600">
              <span>
                {t.pos.subtotal} ({totalItemsCount} {t.pos.itemsCount})
              </span>
              <span className="font-semibold text-stone-900">
                Rp {subtotal.toLocaleString('id-ID')}
              </span>
            </div>

            <div className="flex justify-between text-stone-600">
              <span>{t.pos.discount}</span>
              <span className="font-semibold text-stone-900">
                -Rp {discountTotal.toLocaleString('id-ID')}
              </span>
            </div>

            <div className="flex justify-between items-baseline pt-2">
              <span className="font-bold text-stone-900 text-sm">{t.pos.total}</span>
              <span className="font-black text-xl text-[#991B1B]">
                Rp {grandTotal.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          {/* Payment Methods (Tunai, QRIS, Transfer) */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              onClick={() => {
                setPaymentMethod('TUNAI');
                setCashGiven(grandTotal);
              }}
              className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                paymentMethod === 'TUNAI'
                  ? 'border border-[#991B1B] bg-[#FDF2F2] text-[#991B1B]'
                  : 'border border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
              }`}
            >
              <Banknote className="w-3.5 h-3.5" />
              <span>{t.pos.cash}</span>
            </button>

            <button
              onClick={() => {
                setPaymentMethod('QRIS');
                setCashGiven(grandTotal);
              }}
              className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                paymentMethod === 'QRIS'
                  ? 'border border-[#991B1B] bg-[#FDF2F2] text-[#991B1B]'
                  : 'border border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>{t.pos.qris}</span>
            </button>

            <button
              onClick={() => {
                setPaymentMethod('TRANSFER_BANK');
                setCashGiven(grandTotal);
              }}
              className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                paymentMethod === 'TRANSFER_BANK'
                  ? 'border border-[#991B1B] bg-[#FDF2F2] text-[#991B1B]'
                  : 'border border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>{t.pos.transfer}</span>
            </button>
          </div>

          {/* Quick Cash Presets & Change Calculation when TUNAI is selected */}
          {paymentMethod === 'TUNAI' && (
            <div className="p-3 bg-[#FAF7F5] rounded-xl border border-[#F0E6E5] space-y-2.5 text-xs animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-700">Uang Diterima:</span>
                <div className="flex items-center gap-1">
                  <span className="text-stone-400 font-mono">Rp</span>
                  <input
                    type="number"
                    value={cashGiven || ''}
                    onChange={(e) => setCashGiven(Number(e.target.value) || 0)}
                    className="w-28 text-right px-2 py-1 bg-white border border-[#F0E6E5] rounded-lg font-mono font-bold text-stone-900 outline-none focus:border-[#991B1B]"
                  />
                </div>
              </div>

              {/* Preset Buttons */}
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setCashGiven(grandTotal)}
                  className="px-2 py-1 bg-white hover:bg-stone-100 border border-stone-200 rounded-lg text-[10px] font-bold text-stone-700 transition"
                >
                  Uang Pas
                </button>
                {[50000, 100000, 200000].map((nominal) => (
                  <button
                    key={nominal}
                    type="button"
                    onClick={() => setCashGiven(nominal)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold font-mono transition border ${
                      cashGiven === nominal
                        ? 'bg-[#991B1B] text-white border-[#991B1B]'
                        : 'bg-white hover:bg-stone-100 text-stone-700 border-stone-200'
                    }`}
                  >
                    {(nominal / 1000).toLocaleString('id-ID')}k
                  </button>
                ))}
              </div>

              {/* Change (Kembalian) Calculation */}
              <div className="flex items-baseline justify-between pt-1.5 border-t border-[#F0E6E5]">
                <span className="font-bold text-stone-600">Kembalian:</span>
                <span
                  className={`font-mono font-black text-sm tabular-nums ${
                    cashGiven - grandTotal >= 0 ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  Rp {Math.max(0, cashGiven - grandTotal).toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          )}

          {/* Big Checkout Button (matching screenshot 1) */}
          <button
            disabled={cart.length === 0}
            onClick={handleCheckout}
            className={`w-full py-3.5 px-4 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition active:scale-[0.98] ${
              cart.length === 0
                ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                : 'bg-[#991B1B] hover:bg-[#881337] text-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{t.pos.payNow}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
