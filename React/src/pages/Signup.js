import React from "react";

export default function Signup() {
    return (
        <>
            <div className="signup-popup">
                <span className="signup-options">
                    <i class="fa-solid fa-user-tie fa-xl" onClick={() => {
                        handleOptions('tourguide')
                    }}></i>
                    <i class="fa-solid fa-user fa-xl" onClick={() => {
                        handleOptions('user')
                    }}></i>
                </span>
                <div className="signup-body">
                    {
                        showUser ? <form onSubmit={handleLogin}>
                            <h3>Sign up as a User!</h3>
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({ ...formData, email: e.target.value })
                                }
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({ ...formData, email: e.target.value })
                                }
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={(e) =>
                                    setFormData({ ...formData, password: e.target.value })
                                }
                            />
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                value={formData.password}
                                onChange={(e) =>
                                    setFormData({ ...formData, password: e.target.value })
                                }
                            />
                            {errors.password && (
                                <p style={{ color: "red", fontWeight: "bold", fontSize: 12 }}>
                                    {errors.password}
                                </p>
                            )}
                            <input
                                type="text"
                                placeholder="Phone Number"
                                value={formData.password}
                                onChange={(e) =>
                                    setFormData({ ...formData, password: e.target.value })
                                }
                            />
                            <button type="submit">Sign Up</button>
                        </form>
                            : null
                    }
                    {
                        showAdmin ?
                            <form onSubmit={handleLogin}>
                                <h3>Sign in as a Admin!</h3>
                                <input
                                    className="img-admin"
                                    type="file"
                                    accept="image/*"
                                />
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({ ...formData, email: e.target.value })
                                    }
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({ ...formData, email: e.target.value })
                                    }
                                />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={(e) =>
                                        setFormData({ ...formData, password: e.target.value })
                                    }
                                />
                                <input
                                    type="password"
                                    placeholder="Confirm Password"
                                    value={formData.password}
                                    onChange={(e) =>
                                        setFormData({ ...formData, password: e.target.value })
                                    }
                                />
                                {errors.password && (
                                    <p style={{ color: "red", fontWeight: "bold", fontSize: 12 }}>
                                        {errors.password}
                                    </p>
                                )}
                                <input
                                    type="text"
                                    placeholder="Phone Number"
                                    value={formData.password}
                                    onChange={(e) =>
                                        setFormData({ ...formData, password: e.target.value })
                                    }
                                />
                                <button type="submit">Sign Up</button>
                            </form>
                            : null
                    }
                </div>
            </div>
        </>
    )
}