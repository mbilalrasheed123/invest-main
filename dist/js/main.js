// InvestWise Platform - Client-side JavaScript
// All business logic runs on the server. This handles only UI interactions.

document.addEventListener('DOMContentLoaded', () => {
  // Toast notification system
  window.showToast = (message, type = 'success') => {
    const toast = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-primary' : type === 'error' ? 'bg-red-500' : 'bg-amber-500';
    toast.className = `fixed top-6 right-6 z-[9999] ${bgColor} text-white px-6 py-3 rounded-lg shadow-2xl text-sm font-bold flex items-center gap-3 animate-slide-in`;
    toast.innerHTML = `
      <span class="material-symbols-outlined text-lg">${type === 'success' ? 'check_circle' : type === 'error' ? 'error' : 'warning'}</span>
      <span>${message}</span>
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  };

  // Handle Login Form
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = loginForm.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.innerHTML = '<span class="animate-spin material-symbols-outlined text-sm">progress_activity</span> Logging in...';
      btn.disabled = true;

      try {
        const formData = new FormData(loginForm);
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.get('email'),
            password: formData.get('password')
          })
        });
        const data = await res.json();
        if (data.success) {
          showToast('Login successful! Redirecting...');
          setTimeout(() => {
            window.location.href = data.user.role === 'admin' ? 'admin.html' : 'dashboard.html';
          }, 800);
        } else {
          showToast(data.error || 'Invalid credentials', 'error');
          btn.innerHTML = originalText;
          btn.disabled = false;
        }
      } catch (err) {
        showToast('Connection error. Please try again.', 'error');
        btn.innerHTML = originalText;
        btn.disabled = false;
      }
    });
  }

  // Handle Register Form
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = registerForm.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.innerHTML = '<span class="animate-spin material-symbols-outlined text-sm">progress_activity</span> Creating account...';
      btn.disabled = true;

      try {
        const formData = new FormData(registerForm);
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword')
          })
        });
        const data = await res.json();
        if (data.success) {
          showToast('Account created! Redirecting to dashboard...');
          setTimeout(() => window.location.href = 'dashboard.html', 800);
        } else {
          showToast(data.error || 'Registration failed', 'error');
          btn.innerHTML = originalText;
          btn.disabled = false;
        }
      } catch (err) {
        showToast('Connection error. Please try again.', 'error');
        btn.innerHTML = originalText;
        btn.disabled = false;
      }
    });
  }

  // Handle Logout
  const logoutBtns = document.querySelectorAll('.logout-btn');
  logoutBtns.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      await fetch('/api/auth/logout');
      window.location.href = 'login.html';
    });
  });

  // Handle Deposit Form
  const depositForm = document.getElementById('depositForm');
  if (depositForm) {
    depositForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = depositForm.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.innerHTML = 'Submitting...';
      btn.disabled = true;

      try {
        const formData = new FormData(depositForm);
        const res = await fetch('/api/deposits', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        if (data.success) {
          showToast('Deposit request submitted successfully!');
          setTimeout(() => window.location.reload(), 1000);
        } else {
          showToast(data.error || 'Deposit failed', 'error');
          btn.innerHTML = originalText;
          btn.disabled = false;
        }
      } catch (err) {
        showToast('Connection error', 'error');
        btn.innerHTML = originalText;
        btn.disabled = false;
      }
    });
  }

  // Handle Withdrawal Form
  const withdrawForm = document.getElementById('withdrawForm');
  if (withdrawForm) {
    withdrawForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = withdrawForm.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.innerHTML = 'Submitting...';
      btn.disabled = true;

      try {
        const formData = new FormData(withdrawForm);
        const res = await fetch('/api/withdrawals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: formData.get('amount'),
            walletAddress: formData.get('walletAddress'),
            paymentMethod: formData.get('paymentMethod')
          })
        });
        const data = await res.json();
        if (data.success) {
          showToast('Withdrawal request submitted!');
          setTimeout(() => window.location.reload(), 1000);
        } else {
          showToast(data.error || 'Withdrawal failed', 'error');
          btn.innerHTML = originalText;
          btn.disabled = false;
        }
      } catch (err) {
        showToast('Connection error', 'error');
        btn.innerHTML = originalText;
        btn.disabled = false;
      }
    });
  }

  // Handle Investment Form
  const investForm = document.getElementById('investForm');
  if (investForm) {
    investForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = investForm.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.innerHTML = 'Processing...';
      btn.disabled = true;

      try {
        const formData = new FormData(investForm);
        const res = await fetch('/api/investments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            planId: formData.get('planId'),
            amount: formData.get('amount')
          })
        });
        const data = await res.json();
        if (data.success) {
          showToast(data.message || 'Investment created!');
          setTimeout(() => window.location.href = '/dashboard', 1000);
        } else {
          showToast(data.error || 'Investment failed', 'error');
          btn.innerHTML = originalText;
          btn.disabled = false;
        }
      } catch (err) {
        showToast('Connection error', 'error');
        btn.innerHTML = originalText;
        btn.disabled = false;
      }
    });
  }

  // Handle Profile Update
  const profileForm = document.getElementById('profileForm');
  if (profileForm) {
    profileForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        const formData = new FormData(profileForm);
        const res = await fetch('/api/user/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.get('name'),
            email: formData.get('email')
          })
        });
        const data = await res.json();
        if (data.success) {
          showToast('Profile updated!');
          setTimeout(() => window.location.reload(), 500);
        } else {
          showToast(data.error || 'Update failed', 'error');
        }
      } catch (err) {
        showToast('Connection error', 'error');
      }
    });
  }

  // Handle Password Change
  const passwordForm = document.getElementById('passwordForm');
  if (passwordForm) {
    passwordForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        const formData = new FormData(passwordForm);
        const res = await fetch('/api/user/updatepassword', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            currentPassword: formData.get('currentPassword'),
            newPassword: formData.get('newPassword'),
            confirmPassword: formData.get('confirmPassword')
          })
        });
        const data = await res.json();
        if (data.success) {
          showToast('Password changed successfully!');
          passwordForm.reset();
        } else {
          showToast(data.error || 'Password change failed', 'error');
        }
      } catch (err) {
        showToast('Connection error', 'error');
      }
    });
  }

  // Admin: Process Deposit
  window.processDeposit = async (depositId, status) => {
    if (!confirm(`Are you sure you want to ${status} this deposit?`)) return;
    try {
      const res = await fetch(`/api/admin/deposits/${depositId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Deposit ${status} successfully!`);
        setTimeout(() => window.location.reload(), 500);
      } else {
        showToast(data.error || 'Operation failed', 'error');
      }
    } catch (err) {
      showToast('Connection error', 'error');
    }
  };

  // Admin: Process Withdrawal
  window.processWithdrawal = async (withdrawalId, status) => {
    if (!confirm(`Are you sure you want to ${status} this withdrawal?`)) return;
    try {
      const res = await fetch(`/api/admin/withdrawals/${withdrawalId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Withdrawal ${status} successfully!`);
        setTimeout(() => window.location.reload(), 500);
      } else {
        showToast(data.error || 'Operation failed', 'error');
      }
    } catch (err) {
      showToast('Connection error', 'error');
    }
  };

  // Admin: Update User Status
  window.updateUserStatus = async (userId, status) => {
    if (!confirm(`Are you sure you want to ${status} this user?`)) return;
    try {
      const res = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`User ${status} successfully!`);
        setTimeout(() => window.location.reload(), 500);
      } else {
        showToast(data.error || 'Operation failed', 'error');
      }
    } catch (err) {
      showToast('Connection error', 'error');
    }
  };

  // Admin: Create/Update Plan
  window.savePlan = async (formId, planId = null) => {
    const form = document.getElementById(formId);
    if (!form) return;
    const formData = new FormData(form);
    const body = {
      name: formData.get('name'),
      description: formData.get('description'),
      minAmount: parseFloat(formData.get('minAmount')),
      maxAmount: parseFloat(formData.get('maxAmount')),
      roiPercentage: parseFloat(formData.get('roiPercentage')),
      durationDays: parseInt(formData.get('durationDays')),
      referralBonus: parseFloat(formData.get('referralBonus') || 0),
      supportLevel: formData.get('supportLevel') || 'Standard',
      status: formData.get('status') || 'active'
    };

    const url = planId ? `/api/admin/plans/${planId}` : '/api/admin/plans';
    const method = planId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Plan ${planId ? 'updated' : 'created'} successfully!`);
        setTimeout(() => window.location.reload(), 500);
      } else {
        showToast(data.error || 'Operation failed', 'error');
      }
    } catch (err) {
      showToast('Connection error', 'error');
    }
  };

  // Admin: Delete Plan
  window.deletePlan = async (planId) => {
    if (!confirm('Are you sure you want to delete this plan?')) return;
    try {
      const res = await fetch(`/api/admin/plans/${planId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('Plan deleted successfully!');
        setTimeout(() => window.location.reload(), 500);
      } else {
        showToast(data.error || 'Delete failed', 'error');
      }
    } catch (err) {
      showToast('Connection error', 'error');
    }
  };

  // Password visibility toggle
  document.querySelectorAll('.toggle-password').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.closest('.relative').querySelector('input');
      const icon = btn.querySelector('.material-symbols-outlined');
      if (input.type === 'password') {
        input.type = 'text';
        icon.textContent = 'visibility';
      } else {
        input.type = 'password';
        icon.textContent = 'visibility_off';
      }
    });
  });

  // Forgot password form
  const forgotForm = document.getElementById('forgotPasswordForm');
  if (forgotForm) {
    forgotForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(forgotForm);
      try {
        const res = await fetch('/api/auth/forgotpassword', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.get('email') })
        });
        const data = await res.json();
        if (data.success) {
          showToast('Password reset link generated. Check your email.');
        } else {
          showToast(data.error || 'Failed', 'error');
        }
      } catch (err) {
        showToast('Connection error', 'error');
      }
    });
  }
});
