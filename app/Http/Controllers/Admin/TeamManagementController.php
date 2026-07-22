<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class TeamManagementController extends Controller
{
    public function index(Request $request): Response
    {
        $searchQuery = trim((string) $request->get('search', ''));

        $team = User::query()
            ->withCount('yardScans') 
            ->when($searchQuery !== '', function ($query) use ($searchQuery) {
                $query->where(function ($q) use ($searchQuery) {
                    $q->where('name', 'like', "%{$searchQuery}%")
                      ->orWhere('email', 'like', "%{$searchQuery}%");
                });
            })
            ->orderByDesc('id')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Team/Index', [
            'team' => $team,
            'filters' => [
                'search' => $searchQuery,
            ],
        ]);
    }

    public function show(User $user): Response
    {
        $user->load(['yardScans' => function($query) {
            $query->latest()->limit(5);
        }]);

        return Inertia::render('Admin/Team/Show', [
            'user' => $user,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Team/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'max:255', 'confirmed'],
            'role'     => ['required', Rule::in(['admin', 'manager', 'dispatcher'])], 
        ]);

        User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'role'     => $validated['role'],
            'password' => Hash::make($validated['password']), 
        ]);

        return redirect()
            ->route('admin.team.index')
            ->with('success', 'Team member added successfully.');
    }

    public function edit(User $user): Response
    {
        return Inertia::render('Admin/Team/Edit', [
            'user' => $user,
        ]);
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'name'  => ['required', 'string', 'max:255'],
            'email' => [
                'required', 'email', 'max:255',
                Rule::unique('users', 'email')->ignore($user->id),
            ],
            'role'  => ['required', Rule::in(['admin', 'manager', 'dispatcher'])],
            'password' => ['nullable', 'string', 'min:8', 'max:255'],
        ]);

        $user->name  = $validated['name'];
        $user->email = $validated['email'];
        $user->role  = $validated['role'];

        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        return redirect()
            ->route('admin.team.index')
            ->with('success', 'Team member details updated successfully.');
    }

    public function destroy(User $user): RedirectResponse
    {
        if (auth()->check() && auth()->id() === $user->id) {
            return back()->with('error', 'You cannot delete your own active account.');
        }

        $user->delete();

        return redirect()
            ->route('admin.team.index')
            ->with('success', 'Team member removed successfully.');
    }
}